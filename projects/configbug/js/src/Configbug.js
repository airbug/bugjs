//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('configbug')

//@Export('Configbug')

//@Require('Class')
//@Require('Config')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Config      = bugpack.require('Config');
var Map         = bugpack.require('Map');
var Obj         = bugpack.require('Obj');
var TypeUtil    = bugpack.require('TypeUtil');
var BugFlow     = bugpack.require('bugflow.BugFlow');
var BugFs       = bugpack.require('bugfs.BugFs');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $if         = BugFlow.$if;
var $series     = BugFlow.$series;
var $task       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var Configbug = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} configPath
     */
    _constructor: function(configPath) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, Config>}
         */
        this.builtConfigMap     = new Map();

        /**
         * @private
         * @type {Path}
         */
        this.configPath         = configPath;

        /**
         * @private
         * @type {Map.<string, Config>}
         */
        this.loadedConfigMap    = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {Map.<string, Config>}
     */
    getBuiltConfigMap: function() {
        return this.builtConfigMap;
    },

    /**
     * @returns {Path}
     */
    getConfigPath: function() {
        return this.configPath;
    },

    /**
     * @returns {Map.<string, Config>}
     */
    getLoadedConfigMap: function() {
        return this.loadedConfigMap;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} configName
     * @param {function(Throwable, Config)} callback
     */
    getConfig: function(configName, callback) {
        this.buildConfig(configName, callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} configName
     * @param {function(Throwable, Config=)} callback
     */
    buildConfig: function(configName, callback) {
        var _this = this;
        if (this.builtConfigMap.containsKey(configName)) {
            callback(undefined, this.builtConfigMap.get(configName));
        } else {
            this.doBuildConfig(configName, function(throwable, config) {
                if (!throwable) {
                    _this.builtConfigMap.put(configName, config);
                    callback(undefined, config);
                } else {
                    callback(throwable);
                }
            });
        }
    },

    /**
     * @private
     * @param {string} configName
     * @param {function(Throwable, Config=)} callback
     */
    doBuildConfig: function(configName, callback) {
        var _this           = this;
        var buildingConfig  = undefined;
        $series([
            $task(function(flow) {
                _this.loadConfig("", function(throwable, config) {
                    if (!throwable) {
                        if (config) {
                            buildingConfig = config;
                        }
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.loadConfig(configName, function(throwable, config) {
                    if (!throwable) {
                        if (config) {
                            if (buildingConfig) {
                                buildingConfig.updateProperties(config.toObject());
                            } else {
                                buildingConfig = config;
                            }
                        } else {
                            throwable = new Error("Could not find config by the name of '" + configName + "'");
                        }
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(undefined, buildingConfig);
            } else {
                callback(throwable);
            }
        })
    },

    /**
     * @private
     * @param {string} configName
     * @param {function(Throwable, Config=)} callback
     */
    loadConfig: function(configName, callback) {
        var _this = this;
        if (this.loadedConfigMap.containsKey(configName)) {
            callback(undefined, this.loadedConfigMap.get(configName));
        } else {
            var configFileName = "config.json";
            if (configName) {
                configFileName = configName + "-" + configFileName;
            }
            var configPath = BugFs.resolvePaths([this.configPath, configFileName]);
            this.doLoadConfig(configPath, function(throwable, config) {
                if (!throwable) {
                    _this.loadedConfigMap.put(configName, config);
                    callback(undefined, config);
                } else {
                    callback(throwable);
                }
            });
        }
    },

    /**
     * @private
     * @param {Path} configPath
     * @param {function(Throwable, Config=)} callback
     */
    doLoadConfig: function(configPath, callback) {
        var loadedConfig = undefined;
        $series([
            $if(function(flow) {
                    BugFs.exists(configPath, function(throwable, exists) {
                        if (!throwable) {
                            flow.assert(exists);
                        } else {
                            flow.error(throwable);
                        }
                    });
                },
                $task(function(flow) {
                    BugFs.readFile(configPath, 'utf8', function(throwable, data) {
                        if (!throwable) {
                            loadedConfig = new Config(JSON.parse(data));
                        }
                        flow.complete(throwable);
                    });
                })
            )
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(undefined, loadedConfig);
            } else {
                callback(throwable);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('configbug.Configbug', Configbug);
