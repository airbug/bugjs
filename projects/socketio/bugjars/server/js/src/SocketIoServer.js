//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:server')

//@Export('SocketIoServer')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Proxy')
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
var Proxy           = bugpack.require('Proxy');
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
        this.expressServer  = expressServer;

        /**
         * @private
         * @type {*}
         */
        this.ioServer = io.listen(this.expressServer.getHttpServer());

        Proxy.proxy(this, this.ioServer, [
            "of"
        ]);
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
                        console.log("SocketIo server configured");
                    } else {
                        console.log("SocketIo server failed to configure");
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
        this.ioServer.set('match origin protocol', this.config.getMatchOriginProtocol()); //NOTE: Only necessary for use with wss, WebSocket Secure protocol
        this.ioServer.set('resource', this.config.getResource()); //NOTE: forward slash is required here unlike client setting
        this.ioServer.set('transports', this.config.getTransports());

        this.ioServer.configure(function () {
            _this.ioServer.set('authorization', function (handshakeData, callback) {
                //TEST
                console.log(handshakeData);

                callback(null, true); // error first callback style
            });
        });
        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('socketio:server.SocketIoServer', SocketIoServer);
