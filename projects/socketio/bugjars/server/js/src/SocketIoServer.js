//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:server')

//@Export('SocketIoServer')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();
var io              = require('socket.io');


//-------------------------------------------------------------------------------
// BugPack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var EventDispatcher = bugpack.require('EventDispatcher');
var BugFlow         = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $forInParallel      = BugFlow.$forInParallel;
var $if                 = BugFlow.$if;
var $series             = BugFlow.$series;
var $parallel           = BugFlow.$parallel;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoServer = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(config, expressServer) {

        this._super();

        /**
         * @private
         * @type {SocketIoServerConfig}
         */
        this.config         = config;

        /**
         * @private
         * @type {ExpressServer}
         */
        this.expressServer  = null;


        //-------------------------------------------------------------------------------
        // Native Listeners
        //-------------------------------------------------------------------------------

        var _this = this;
        this.handleSocketManagerConnection = function(socket) {
            _this.processNewSocket(socket);
        }
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    start: function(callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.configure(function(error) {
                    if (!error) {
                        console.log("Sonarbug server configured");
                    } else {
                        console.log("Sonarbug server failed to configure");
                    }
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                _this.initialize(function(error){
                    if (!error) {
                        console.log("Sonarbug server initialized");
                    } else {
                        console.log("Sonarbug server failed to initialize");
                    }
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {function()} callback
     */
    configure: function(callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.processConfig(function(error) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this.expressApp.configure(function() {
                    _this.expressApp.set('port', _this.config.port || 3000);
                    _this.expressApp.use(function (req, res, next) {
                        res.removeHeader("X-Powered-By");
                        next();
                    });
                    // app.use(express.favicon());
                    _this.expressApp.use(express.logger('dev'));
                    // app.use(express.bodyParser());
                    // app.use(express.methodOverride());
                    _this.expressApp.use(app.router);
                    // app.use(express.static(path.join(__dirname, 'public')));
                });

                _this.expressApp.configure('development', function(){
                    _this.expressApp.use(express.errorHandler());
                });
                flow.complete();
            })
        ]).execute(callback);
    },

    /**
     * @private
     * @param {function()} callback
     */
    initialize: function(callback){
        var _this = this;
        $series([
            $task(function(flow){
                _this.logsManager.initialize(_this.config, _this.configFilePath, function(error){
                    if(!error){
                        console.log('Log folders initialized and updated');
                        flow.complete();
                    } else {
                        console.log(error);
                        flow.complete();
                    }
                });
            }),
            $parallel([
                $task(function(flow){
                    _this.enableSockets(function(){
                        console.log("Sonarbug sockets enabled");
                    });

                    _this.expressServer.listen(_this.app.get('port'), function(){
                        console.log("Sonarbug listening on port", _this.app.get('port'));
                    });

                    flow.complete();

                }),
                // Set interval for log rotations
                $task(function(flow){
                    var config = _this.config;
                    setInterval(function(){
                        _this.logsManager.rotateLogs();
                    }, config.logRotationInterval);
                    flow.complete();
                }),
                $task(function(flow){
                    _this.initializePackageAndUploadCronJob(function() {
                        console.log('packageAndUploadCronJob initialized');
                        _this.startPackageAndUploadCronJob(function() {
                            flow.complete();
                        });
                    });
                })
            ])
        ]).execute(callback);
    },


    /**
     * @private
     */
    enableSockets: function() {
        var ioManager               = io.listen(this.expressServer.getHttpServer()); //NOTE: Global namespace

        ioManager.set('transports', [
            'websocket',
            'flashsocket',
            'htmlfile',
            'xhr-polling',
            'jsonp-polling'
        ]);
        ioManager.set('match origin protocol', true); //NOTE: Only necessary for use with wss, WebSocket Secure protocol
        ioManager.set('resource', '/socket-api'); //NOTE: forward slash is required here unlike client setting

        var socketApiManager = ioManager.of('/socket-api'); //NOTE: @return local namespace manager
        socketApiManager.on('connection', this.handleSocketManagerConnection);
    },

    processConfig: function(callback) {
        var _this = this;
        var configFile      = path.resolve(__dirname, '..', 'sonarbug.config.json');
        var configDefault   = {
            "currentCompletedId": 1,
            "logRotationInterval": 3600000,
            "cronJobs": {
                "packageAndUpload": {
                    "cronTime": "00 15 */1 * * *",
                    "start": false,
                    "timeZone": "America/Los_Angeles"
                }
            }
        };

        this.configFilePath = configFile;
        BugFs.exists(configFile, function(exists) {
            if (exists) {
                BugFs.readFileSync(configFile, 'utf-8', function(error, data) {
                    if (!error) {
                        _this.config = JSON.parse(data);
                        console.log('sonarbug.config.json read in');
                    }
                    callback(error);
                });
            } else {
                console.log("sonarbug.config.json could not be found");
                console.log("writing sonarbug.config.json file...");
                _this.config = configDefault;
                BugFs.writeFile(configFile, JSON.stringify(configDefault), function(error) {
                    console.log("sonarbug.config.json written with defaults:", configDefault);
                    callback(error);
                });
            }
        });
    },

    /**
     * @private
     * @param {Socket} socket
     */
    processNewSocket: function(socket) {
        console.log("Connection established");

        //TODO BRN: Generate a new Visit here, Also gen


        var logFileName = userID + '-' + visitID + '.log';
        var logFilePath = activeFoldersPath + '/' + logFileName;

        socket.on('tracklog', function(data){

            if (data.eventName === "connect") {

            }
            data.userID = userID;
            data.visitID = visitID;
            _this.logsManager.appendToLogFile(logFilePath, data, function(error){

            });
        });

        socket.on('disconnect', function(){
            var logsManager                 = _this.logsManager;
            var currentCompletedFolderName  = _this.logsManager.currentCompletedFolderName; //BUGBUG
            var logEventManager             = _this.logsManager.logEventManagers[currentCompletedFolderName];

            logEventManager.incrementMoveCount(); //Why is logEventManager undefined? it doesn't exist

            var completedUserFolderPath = completedFoldersPath + '/' + currentCompletedFolderName + '/' + userID + '/';
            var data = {
                eventName: 'disconnect',
                userID: userID,
                visitID: visitID,
                timestamp: new Date(),
                data: null
            };


            logsManager.appendToLogFile(logFilePath, data, function(error){
                if(!error){
                    fs.exists(completedUserFolderPath, function(exists){
                        if(!exists){
                            fs.mkdir(completedUserFolderPath, 0777, function(error){
                                if(!error){
                                    logsManager.moveLogFileToCompletedUserFolder(logFilePath, currentCompletedFolderName, completedUserFolderPath, function(error){
                                        if(error){
                                            console.log(error);
                                        } else {
                                            console.log("successfully moved log file to completed user folder");
                                        }
                                    });
                                } else {
                                    console.log(error);
                                }
                            });
                        } else {
                            logsManager.moveLogFileToCompletedUserFolder(logFilePath, currentCompletedFolderName, completedUserFolderPath, function(error){
                                if(error){
                                    console.log(error);
                                } else {
                                    console.log("successfully moved log file to completed user folder");
                                }
                            });
                        }
                    });
                } else {
                    console.log(error);
                }
            });
        });

        socket.on('error', function(reason){
            console.log('Error:', reason, "userID:", userID, "visitID:", visitID);
        });
    },


    //-------------------------------------------------------------------------------
    // CronJobs: PackageAndUpload
    //-------------------------------------------------------------------------------

    /**
     * @param {function()=} callback
     */
    initializePackageAndUploadCronJob: function(callback){
        var callback = callback || function(){};
        var configOverrides = null;
        var config = {
            cronTime: '00 15 */1 * * *',
            start: false,
            timeZone: "America/Los_Angeles"
            // , context:
            // , onComplete: function(){}
        };

        if (this.config.cronJobs) {
            configOverrides = this.config.cronJobs.packageAndUpload;
        }

        if(configOverrides){
            for(var prop in configOverrides){
                config[prop] = configOverrides[prop];
            }
        }

        console.log('packageAndUploadCronJob settings:', config);

        config.onTick = function(){
            var options = {
                cwd: path.resolve(__dirname, '..', 'scripts/')
            };
            child_process.exec('node packageandupload.js', options, function(error, stdout, stderr){
                console.log('stdout: ', stdout);
                console.log('stderr: ', stderr);
                if (error) {
                    console.log('exec error: ', error);
                }
            });
        };
        var job = new CronJob(config);
        this.cronJobs.packageAndUpload = job;

        callback();
    },

    /**
     * @param {function()=} callback
     */
    startPackageAndUploadCronJob: function(callback){
        var callback = callback || function(){};
        var job = this.cronJobs.packageAndUpload;
        if(job){
            job.start();
            console.log("packageAndUploadCronJob started");
        } else {
            console.log("packageAndUploadCronJob does not exist \n Please initialize cron job first");
        }

        callback();
    },

    /**
     * @param {function()=} callback
     */
    stopPackageAndUploadCronJob: function(callback){
        var callback = callback || function(){};
        var job = this.cronJobs.packageAndUpload;
        if(job){
            if(job.running){
                job.stop();
                console.log("packageAndUploadCronJob stopped");
            } else {
                console.log("packageAndUploadCronJob is not running");
            }
        } else {
            console.log("packageAndUploadCronJob does not exist \n Please configure cron job first");
        }

        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('socketio:server.SocketIoServer', SocketIoServer);
