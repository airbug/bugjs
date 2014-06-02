/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('configbug.Configbug')
//@Autoload

//@Require('Class')
//@Require('Config')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

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
    var ModuleTag   = bugpack.require('bugioc.ModuleTag');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var module      = ModuleTag.module;
    var $if                     = BugFlow.$if;
    var $series                 = BugFlow.$series;
    var $task                   = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Configbug = Class.extend(Obj, {

        _name: "configbug.Configbug",


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
         * @param {Path} configPath
         */
        setConfigPath: function(configPath) {
            this.configPath = configPath;
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
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(Configbug).with(
        module("configbug")
    );


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('configbug.Configbug', Configbug);
});
