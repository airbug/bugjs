//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('BugIOC')

//@Require('Class')
//@Require('DependencyGraph')
//@Require('Obj')
//@Require('PrototypeScope')
//@Require('Proxy')
//@Require('Set')
//@Require('SingletonScope')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugIOC = Class.extend(Obj, {

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
         * @type {Map<IOCConfiguration, *>}
         */
        this.iocConfigurationToConfigurationMap = new Map();

        /**
         * @private
         * @type {Map<IOCModule, Scope>}
         */
        this.iocModuleToScopeMap = new Map();

        /**
         * @private
         * @type {Map<string, IOCModule>}
         */
        this.moduleNameToIOCModuleMap = new Map();

        /**
         * @private
         * @type {List<Object>}
         */
        this.registeredIOCConfigurationSet = new Set();
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {IOCModule} iocModule
     * @return {*}
     */
    findConfigurationByIOCModule: function(iocModule) {
        var iocConfiguration = iocModule.getIOCConfiguration();
        return this.iocConfigurationToConfigurationMap.get(iocConfiguration);
    },

    /**
     * @param {string} name
     * @return {IOCModule}
     */
    findIOCModuleByName: function(name) {
        return this.moduleNameToIOCModuleMap.get(name);
    },

    /**
     * @param {IOCModule} iocModule
     * @return {Scope}
     */
    findScopeByIOCModule: function(iocModule) {
        return this.iocModuleToScopeMap.get(iocModule);
    },

    /**
     * @param {string} moduleName
     * @return {*}
     */
    generateModuleByName: function(moduleName) {
        var iocModule = this.findIOCModuleByName(moduleName);
        return this.generateModule(iocModule);
    },

    /**
     *
     */
    process: function() {
        this.buildModuleNameToIOCModuleMap();
        this.buildDependencyGraph();
        this.processIOCConfigurations();
        this.processIOCModules();
        this.initializeConfigurations();
    },

    /**
     * @param {IOCConfiguration} iocConfiguration
     */
    registerIOCConfiguration: function(iocConfiguration) {
        if (!this.registeredIOCConfigurationSet.contains(iocConfiguration)) {
            this.registeredIOCConfigurationSet.add(iocConfiguration);
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

        this.moduleNameToIOCModuleMap.forEach(function(iocModule) {
            _this.dependencyGraph.addNodeForValue(iocModule);
        });
        this.moduleNameToIOCModuleMap.forEach(function(iocModule) {
            var iocArgSet = iocModule.getIOCArgSet();
            iocArgSet.forEach(function(iocArg) {
                var refIOCModule = _this.findIOCModuleByName(iocArg.getRef());
                if (!refIOCModule) {
                    throw new Error("Could not find IOCModule by the name '" + iocArg.getRef() + "'");
                }
                _this.dependencyGraph.addDependency(iocModule, refIOCModule);
            });
            var iocPropertySet = iocModule.getIOCPropertySet();
            iocPropertySet.forEach(function(iocProperty) {
                var refIOCModule = _this.findIOCModuleByName(iocProperty.getRef());
                if (!refIOCModule) {
                    throw new Error("Could not find IOCModule by the name '" + iocProperty.getRef() + "'");
                }
                _this.dependencyGraph.addDependency(iocModule, refIOCModule);
            });
        });
    },

    /**
     * @private
     */
    buildModuleNameToIOCModuleMap: function() {
        var _this = this;
        this.registeredIOCConfigurationSet.forEach(function(configuration) {
            var iocModuleSet = configuration.getIOCModuleSet();
            iocModuleSet.forEach(function(iocModule) {
                if (_this.moduleNameToIOCModuleMap.containsKey(iocModule.getName())) {
                    throw new Error("An IOCModule already exists with the name '" + iocModule.getName() +"'");
                }
                _this.moduleNameToIOCModuleMap.put(iocModule.getName(), iocModule);
            });
        });
    },

    /**
     * @private
     * @param {IOCConfiguration} iocConfiguration
     */
    generateConfiguration: function(iocConfiguration) {
        if (!this.iocConfigurationToConfigurationMap.containsKey(iocConfiguration)) {
            var configurationClass = iocConfiguration.getConfigurationClass();
            var configuration = new configurationClass();
            this.iocConfigurationToConfigurationMap.put(iocConfiguration, configuration);
        } else {
            throw new Error("A configuration has already been created for this IOCConfiguration");
        }
    },

    /**
     * @private
     * @param {IOCModule} iocModule
     * @return {*}
     */
    generateModule: function(iocModule) {
        var scope = this.findScopeByIOCModule(iocModule);
        return scope.generateModule();
    },

    /**
     * @private
     * @param {IOCModule} iocModule
     */
    generateScope: function(iocModule) {
        var scope = null;
        switch(iocModule.getScope()) {
            case IOCModule.Scope.PROTOTYPE:
                scope = new PrototypeScope(this, iocModule);
                break;
            case IOCModule.Scope.SINGLETON:
                scope = new SingletonScope(this, iocModule);
                break;
        }
        this.iocModuleToScopeMap.put(iocModule, scope);
    },

    /**
     * @private
     */
    initializeConfigurations: function() {
        this.iocConfigurationToConfigurationMap.forEach(function(configuration) {
            if (Class.doesImplement(configuration, IConfiguration)) {
                configuration.initializeConfiguration();
            }
        });
    },

    /**
     * @private
     */
    processIOCConfigurations: function() {
        var _this = this;
        this.registeredIOCConfigurationSet.forEach(function(iocConfiguration) {
            _this.generateConfiguration(iocConfiguration);
        });
    },

    /**
     * @private
     */
    processIOCModules: function() {
        var _this = this;
        /** @type {List<IOCModule>} */
        var iocModulesInDependentOrder = this.dependencyGraph.getValuesInDependentOrder();
        iocModulesInDependentOrder.forEach(function(iocModule) {
            _this.generateScope(iocModule);
        });
        iocModulesInDependentOrder.forEach(function(iocModule) {
            _this.generateModule(iocModule);
        });
    }
});


//-------------------------------------------------------------------------------
// Private Static Variables
//-------------------------------------------------------------------------------

/**
 * @private
 * @type {BugIOC}
 */
BugIOC.instance = null;


//-------------------------------------------------------------------------------
// Bootstrap
//-------------------------------------------------------------------------------

BugIOC.instance = new BugIOC();
Proxy.proxy(BugIOC, BugIOC.instance, [
    "generateModuleByName",
    "process",
    "registerIOCConfiguration"
]);
