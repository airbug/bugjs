//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('IocContext')

//@Require('Class')
//@Require('DependencyGraph')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('bugflow.BugFlow')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.IPostProcessModule')
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
var IPostProcessModule      = bugpack.require('bugioc.IPostProcessModule');
var IPreProcessModule       = bugpack.require('bugioc.IPreProcessModule');
var IocModule               = bugpack.require('bugioc.IocModule');
var PrototypeScope          = bugpack.require('bugioc.PrototypeScope');
var SingletonScope          = bugpack.require('bugioc.SingletonScope');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $forEachParallel      = BugFlow.$forEachParallel;


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
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DependencyGraph}
         */
        this.dependencyGraph = new DependencyGraph();

        /**
         * @private
         * @type {Map<IocConfiguration, *>}
         */
        this.iocConfigurationToConfigurationMap = new Map();

        /**
         * @private
         * @type {Map<IocModule, Scope>}
         */
        this.iocModuleToScopeMap = new Map();

        /**
         * @private
         * @type {Map<string, IocModule>}
         */
        this.moduleNameToIocModuleMap = new Map();

        /**
         * @private
         * @type {List<Object>}
         */
        this.registeredIocConfigurationSet = new Set();
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {IocModule} iocModule
     * @return {*}
     */
    findConfigurationByIocModule: function(iocModule) {
        var iocConfiguration = iocModule.getIocConfiguration();
        return this.iocConfigurationToConfigurationMap.get(iocConfiguration);
    },

    /**
     * @param {string} name
     * @return {IocModule}
     */
    findIocModuleByName: function(name) {
        return this.moduleNameToIocModuleMap.get(name);
    },

    /**
     * @param {IocModule} iocModule
     * @return {Scope}
     */
    findScopeByIocModule: function(iocModule) {
        return this.iocModuleToScopeMap.get(iocModule);
    },

    /**
     * @param {string} moduleName
     * @return {*}
     */
    generateModuleByName: function(moduleName) {
        var iocModule = this.findIocModuleByName(moduleName);
        return this.generateModule(iocModule);
    },

    /**
     * @param {function(Error)} callback
     */
    initialize: function(callback) {
        this.initializeConfigurations(callback);
    },

    /**
     *
     */
    process: function() {
        this.buildModuleNameToIocModuleMap();
        this.buildDependencyGraph();
        this.processIocConfigurations();
        this.processIocModules();
    },

    /**
     * @param {IocConfiguration} iocConfiguration
     */
    registerIocConfiguration: function(iocConfiguration) {
        if (!this.registeredIocConfigurationSet.contains(iocConfiguration)) {
            this.registeredIocConfigurationSet.add(iocConfiguration);
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
                } else {
                    throw new Error("IocArg at index " + index + " in IocModule '" + iocModule.getName() + "' did not specify reference");
                }
            });
            var iocPropertySet = iocModule.getIocPropertySet();
            iocPropertySet.forEach(function(iocProperty) {
                var refIocModule = _this.findIocModuleByName(iocProperty.getRef());
                if (!refIocModule) {
                    throw new Error("Could not find IocModule by the name '" + iocProperty.getRef() + "'");
                }
                _this.dependencyGraph.addDependency(iocModule, refIocModule);
            });
        });
    },

    /**
     * @private
     */
    buildModuleNameToIocModuleMap: function() {
        var _this = this;
        this.registeredIocConfigurationSet.forEach(function(configuration) {
            var iocModuleSet = configuration.getIocModuleSet();
            iocModuleSet.forEach(function(iocModule) {
                if (_this.moduleNameToIocModuleMap.containsKey(iocModule.getName())) {
                    throw new Error("An IocModule already exists with the name '" + iocModule.getName() +"'");
                }
                _this.moduleNameToIocModuleMap.put(iocModule.getName(), iocModule);
            });
        });
    },

    /**
     * @private
     * @param {IocConfiguration} iocConfiguration
     */
    generateConfiguration: function(iocConfiguration) {
        if (!this.iocConfigurationToConfigurationMap.containsKey(iocConfiguration)) {
            var configurationClass = iocConfiguration.getConfigurationClass();
            var configuration = new configurationClass();
            this.iocConfigurationToConfigurationMap.put(iocConfiguration, configuration);
        } else {
            throw new Error("A configuration has already been created for this IocConfiguration");
        }
    },

    /**
     * @private
     * @param {IocModule} iocModule
     * @return {*}
     */
    generateModule: function(iocModule) {
        var _this           = this;
        var scope           = this.findScopeByIocModule(iocModule);
        var moduleArgs      = [];
        var iocArgList      = iocModule.getIocArgList();
        iocArgList.forEach(function(iocArg) {
            var refModule = _this.generateModuleByName(iocArg.getRef());
            moduleArgs.push(refModule);
        });
        var module = scope.generateModule(moduleArgs);


        var iocPropertySet = this.iocModule.getIocPropertySet();
        iocPropertySet.forEach(function(iocProperty) {
            module[iocProperty.getName()] = _this.iocContext.generateModuleByName(iocProperty.getRef());
        });

        return module;
    },


    /**
     * @private
     * @param {IocModule} iocModule
     */
    generateScope: function(iocModule) {
        var scope = null;
        switch(iocModule.getScope()) {
            case IocModule.Scope.PROTOTYPE:
                scope = new PrototypeScope(this, iocModule);
                break;
            case IocModule.Scope.SINGLETON:
                scope = new SingletonScope(this, iocModule);
                break;
        }
        this.iocModuleToScopeMap.put(iocModule, scope);
    },

    /**
     * @private
     * @param {function(Error)} callback
     */
    initializeConfigurations: function(callback) {
        $forEachParallel(this.iocConfigurationToConfigurationMap.getValueArray(), function(flow, configuration) {
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
     */
    processIocConfigurations: function() {
        var _this = this;
        this.registeredIocConfigurationSet.forEach(function(iocConfiguration) {
            _this.generateConfiguration(iocConfiguration);
        });
    },

    /**
     * @private
     */
    processIocModules: function() {
        var _this = this;
        /** @type {List<IocModule>} */
        var iocModulesInDependentOrder = this.dependencyGraph.getValuesInDependentOrder();
        iocModulesInDependentOrder.forEach(function(iocModule) {
            _this.generateScope(iocModule);
        });
        iocModulesInDependentOrder.forEach(function(iocModule) {
            if (Class.doesImplement(iocModule, IPostProcessModule)) {
                iocModule.preProcessModule();
            }
            _this.generateModule(iocModule);

        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.IocContext', IocContext);
