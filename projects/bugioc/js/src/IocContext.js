//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.IocContext')

//@Require('Class')
//@Require('DependencyGraph')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('bugflow.BugFlow')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.IProcessModule')
//@Require('bugioc.IPreProcessModule')
//@Require('bugioc.IocModule')
//@Require('bugioc.PrototypeScope')
//@Require('bugioc.SingletonScope')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var DependencyGraph         = bugpack.require('DependencyGraph');
var Map                     = bugpack.require('Map');
var Obj                     = bugpack.require('Obj');
var Set                     = bugpack.require('Set');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var IConfiguration          = bugpack.require('bugioc.IConfiguration');
var IInitializeModule       = bugpack.require('bugioc.IInitializeModule');
var IProcessModule          = bugpack.require('bugioc.IProcessModule');
var IPreProcessModule       = bugpack.require('bugioc.IPreProcessModule');
var IocModule               = bugpack.require('bugioc.IocModule');
var PrototypeScope          = bugpack.require('bugioc.PrototypeScope');
var SingletonScope          = bugpack.require('bugioc.SingletonScope');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $iterableParallel       = BugFlow.$iterableParallel;
var $iterableSeries         = BugFlow.$iterableSeries;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var IocContext = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DependencyGraph}
         */
        this.dependencyGraph                        = new DependencyGraph();

        /**
         * @private
         * @type {Set.<IInitializeModule>}
         */
        this.initializedModuleSet                   = new Set();

        /**
         * @private
         * @type {Set.<IInitializeModule>}
         */
        this.initializingModuleSet                  = new Set();

        /**
         * @private
         * @type {Map<IocModule, Scope>}
         */
        this.iocModuleToScopeMap                    = new Map();

        /**
         * @private
         * @type {Map.<string, IocModule>}
         */
        this.moduleNameToIocModuleMap               = new Map();

        /**
         * @private
         * @type {Set.<*>}
         */
        this.processedModuleSet                     = new Set();

        /**
         * @private
         * @type {List.<IocModule>}
         */
        this.registeredConfigurationIocModuleSet    = new Set();

        /**
         * @private
         * @type {Set.<IocModule>}
         */
        this.registeredIocModuleSet                 = new Set();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitialize: function(callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.deinitializeModules(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.deinitializeConfigurations(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    },

    /**
     * @param {string} name
     * @return {IocModule}
     */
    findIocModuleByName: function(name) {
        return this.moduleNameToIocModuleMap.get(name);
    },

    /**
     * @param {string} moduleName
     * @return {*}
     */
    getModuleByName: function(moduleName) {
        var iocModule = this.findIocModuleByName(moduleName);
        return this.generateModule(iocModule);
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initialize: function(callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.initializeModules(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.initializeConfigurations(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    },

    /**
     *
     */
    process: function() {
        this.buildDependencyGraph();
        this.processIocModules();
    },

    /**
     * @param {IocModule} configurationIocModule
     */
    registerConfigurationIocModule: function(configurationIocModule) {
        if (!this.registeredConfigurationIocModuleSet.contains(configurationIocModule)) {
            this.registeredConfigurationIocModuleSet.add(configurationIocModule);
            this.registerIocModule(configurationIocModule);
        }
    },

    /**
     * @param {IocModule} iocModule
     */
    registerIocModule: function(iocModule) {
        if (!this.registeredIocModuleSet.contains(iocModule)) {
            if (this.moduleNameToIocModuleMap.containsKey(iocModule.getName())) {
                throw new Error("IocContext already has a module by the name of '" + iocModule.getName() + "'");
            }
            this.registeredIocModuleSet.add(iocModule);
            this.moduleNameToIocModuleMap.put(iocModule.getName(), iocModule);
            console.log("IocModule registered - name:" + iocModule.getName());
        }
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    buildDependencyGraph: function() {
        var _this = this;

        // NOTE BRN: Need to loop twice. First pass adds all the nodes to the graph. Second pass creates the edges.

        this.moduleNameToIocModuleMap.forEach(function(iocModule) {
            _this.dependencyGraph.addNodeForValue(iocModule);
        });
        this.moduleNameToIocModuleMap.forEach(function(iocModule) {
            var iocArgList = iocModule.getIocArgList();
            iocArgList.forEach(function(iocArg, index) {
                if (iocArg.getRef()) {
                    var refIocModule = _this.findIocModuleByName(iocArg.getRef());
                    if (!refIocModule) {
                        throw new Error("Could not find IocModule by the name '" + iocArg.getRef() + "'");
                    }
                    _this.dependencyGraph.addDependency(iocModule, refIocModule);
                }
            });
            var iocPropertySet = iocModule.getIocPropertySet();
            iocPropertySet.forEach(function(iocProperty) {
                if (iocProperty.getRef()) {
                    var refIocModule = _this.findIocModuleByName(iocProperty.getRef());
                    if (!refIocModule) {
                        throw new Error("Could not find IocModule by the name '" + iocProperty.getRef() + "'");
                    }
                    _this.dependencyGraph.addDependency(iocModule, refIocModule);
                }
            });
        });
    },

    /**
     * @private
     * @param {function(Throwable)} callback
     */
    deinitializeConfigurations: function(callback) {
        var _this = this;
        $iterableParallel(this.registeredConfigurationIocModuleSet, function(flow, configurationIocModule) {
            var configuration = _this.generateModule(configurationIocModule);
            if (Class.doesImplement(configuration, IConfiguration)) {
                configuration.deinitializeConfiguration(function(error) {
                    flow.complete(error);
                });
            } else {
                flow.complete();
            }
        }).execute(callback);
    },

    /**
     * @private
     * @param {function(Throwable=)} callback
     */
    deinitializeModules: function(callback) {
        var _this = this;
        $iterableSeries(this.initializedModuleSet.clone(), function(flow, module) {
            module.deinitializeModule(function(throwable) {
                _this.initializedModuleSet.remove(module);
                flow.complete(throwable);
            });
        }).execute(callback);
    },

    /**
     * @private
     * @param {IocModule} iocModule
     * @return {Scope}
     */
    factoryScope: function(iocModule) {
        var scope = null;
        switch (iocModule.getScope()) {
            case IocModule.Scope.PROTOTYPE:
                scope = new PrototypeScope(this, iocModule);
                break;
            case IocModule.Scope.SINGLETON:
                scope = new SingletonScope(this, iocModule);
                break;
        }
        return scope;
    },

    /**
     * @param {IocModule} iocModule
     * @return {Scope}
     */
    findScopeByIocModule: function(iocModule) {
        return this.iocModuleToScopeMap.get(iocModule);
    },

    /**
     * @private
     * @param {IocModule} iocModule
     * @return {*}
     */
    generateModule: function(iocModule) {
        var scope       = this.generateScope(iocModule);
        var module      = scope.generateModule();
        if (!this.hasProcessedModule(module)) {
            this.processModule(iocModule, module);
        }
        return module;
    },

    /**
     * @private
     * @param {IocModule} iocModule
     * @return {Scope}
     */
    generateScope: function(iocModule) {
        var scope = this.findScopeByIocModule(iocModule);
        if (!scope) {
            scope = this.factoryScope(iocModule);
            this.iocModuleToScopeMap.put(iocModule, scope);
        }
        return scope;
    },

    /**
     * @private
     * @param {IocModule} iocModule
     * @return {boolean}
     */
    hasScopeForIocModule: function(iocModule) {
        return this.iocModuleToScopeMap.containsKey(iocModule);
    },

    /**
     * @param {*} module
     * @return {boolean}
     */
    hasProcessedModule: function(module) {
        return this.processedModuleSet.contains(module);
    },

    /**
     * @private
     * @param {function(Throwable=)} callback
     */
    initializeConfigurations: function(callback) {
        var _this = this;
        $iterableParallel(this.registeredConfigurationIocModuleSet, function(flow, configurationIocModule) {
            var configuration = _this.generateModule(configurationIocModule);
            if (Class.doesImplement(configuration, IConfiguration)) {
                configuration.initializeConfiguration(function(error) {
                    flow.complete(error);
                });
            } else {
                flow.complete();
            }
        }).execute(callback);
    },

    /**
     * @private
     * @param {function(Throwable)} callback
     */
    initializeModules: function(callback) {
        var _this = this;
        $iterableSeries(this.initializingModuleSet.clone(), function(flow, module) {
            module.initializeModule(function(throwable) {
                _this.initializingModuleSet.remove(module);
                _this.initializedModuleSet.add(module);
                flow.complete(throwable);
            });
        }).execute(callback);
    },

    /**
     * @private
     */
    processIocModules: function() {
        var _this = this;
        /** @type {List<IocModule>} */
        var iocModulesInDependentOrder = this.dependencyGraph.getValuesInDependentOrder();
        iocModulesInDependentOrder.forEach(function(iocModule) {
            _this.processIocModule(iocModule);
        });
    },

    /**
     * @private
     * @param {IocModule} iocModule
     */
    processIocModule: function(iocModule) {
        //TEST
        console.log("IocContext processIocModule - ", iocModule.getName());
        this.generateModule(iocModule);
    },

    /**
     * @private
     * @param {IocModule} iocModule
     * @param {*} module
     */
    processModule: function(iocModule, module) {

        //TODO BRN: Make this code async

        if (!this.hasProcessedModule(module)) {
            this.processedModuleSet.add(module);
            //TEST
            console.log("Processing module " + iocModule.getName());

            if (Class.doesImplement(module, IPreProcessModule)) {
                module.preProcessModule();
            }
            this.wireModuleProperties(iocModule, module);
            if (Class.doesImplement(module, IProcessModule)) {
                module.processModule();
            }
            if (Class.doesImplement(module, IInitializeModule)) {
                this.initializingModuleSet.add(module);
            }
        }
    },

    /**
     * @private
     * @param {IocModule} iocModule
     * @param {*} module
     */
    wireModuleProperties: function(iocModule, module) {
        var _this           = this;
        var iocPropertySet  = iocModule.getIocPropertySet();
        iocPropertySet.forEach(function(iocProperty) {
            if (iocProperty.getRef()) {
                module[iocProperty.getName()] = _this.getModuleByName(iocProperty.getRef());
            } else {
                module[iocProperty.getName()] = iocProperty.getValue();
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.IocContext', IocContext);
