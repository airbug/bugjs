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

//@Export('bugioc.IocContext')

//@Require('Class')
//@Require('CommandProcessor')
//@Require('DependencyGraph')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Exception')
//@Require('Func')
//@Require('List')
//@Require('Map')
//@Require('Queue')
//@Require('Set')
//@Require('StateMachine')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ContextCommandFactory')
//@Require('bugioc.IModuleProcessor')
//@Require('bugioc.IocDefines')
//@Require('bugioc.IocModule')
//@Require('bugioc.MethodModuleProcessor')
//@Require('bugioc.ModuleProcessorTag')
//@Require('bugioc.PrototypeModuleScope')
//@Require('bugioc.SingletonModuleScope')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var CommandProcessor        = bugpack.require('CommandProcessor');
    var DependencyGraph         = bugpack.require('DependencyGraph');
    var Event                   = bugpack.require('Event');
    var EventDispatcher         = bugpack.require('EventDispatcher');
    var Exception               = bugpack.require('Exception');
    var Func                    = bugpack.require('Func');
    var List                    = bugpack.require('List');
    var Map                     = bugpack.require('Map');
    var Queue                   = bugpack.require('Queue');
    var Set                     = bugpack.require('Set');
    var StateMachine            = bugpack.require('StateMachine');
    var BugFlow                 = bugpack.require('bugflow.BugFlow');
    var ContextCommandFactory   = bugpack.require('bugioc.ContextCommandFactory');
    var IModuleProcessor        = bugpack.require('bugioc.IModuleProcessor');
    var IocDefines              = bugpack.require('bugioc.IocDefines');
    var IocModule               = bugpack.require('bugioc.IocModule');
    var MethodModuleProcessor   = bugpack.require('bugioc.MethodModuleProcessor');
    var ModuleProcessorTag      = bugpack.require('bugioc.ModuleProcessorTag');
    var PrototypeModuleScope    = bugpack.require('bugioc.PrototypeModuleScope');
    var SingletonModuleScope    = bugpack.require('bugioc.SingletonModuleScope');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $iterableSeries         = BugFlow.$iterableSeries;
    var $series                 = BugFlow.$series;
    var $task                   = BugFlow.$task;
    var bugmeta                 = BugMeta.context();


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var IocContext = Class.extend(EventDispatcher, {

        _name: "bugioc.IocContext",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandProcessor}
             */
            this.commandProcessor                       = new CommandProcessor();

            /**
             * @private
             * @type {ContextCommandFactory}
             */
            this.contextCommandFactory                  = new ContextCommandFactory();

            /**
             * @private
             * @type {StateMachine}
             */
            this.contextStateMachine                    = new StateMachine({
                initialState: IocDefines.ContextState.NOT_READY,
                states: [
                    IocDefines.ContextState.NOT_READY,
                    IocDefines.ContextState.READY,
                    IocDefines.ContextState.RUNNING
                ]
            });

            /**
             * @private
             * @type {DependencyGraph}
             */
            this.dependencyGraph                        = new DependencyGraph();

            /**
             * @private
             * @type {boolean}
             */
            this.generated                              = false;

            /**
             * @private
             * @type {Set.<Module>}
             */
            this.generatedModuleSet                     = new Set();

            /**
             * @private
             * @type {List.<Module>}
             */
            this.initializedModuleList                  = new List();

            /**
             * @private
             * @type {Queue.<Module>}
             */
            this.initializingModuleQueue                = new Queue();

            /**
             * @private
             * @type {Map.<IocModule, ModuleScope>}
             */
            this.iocModuleToModuleScopeMap              = new Map();

            /**
             * @private
             * @type {Map.<string, IocModule>}
             */
            this.moduleNameToIocModuleMap               = new Map();

            /**
             * @private
             * @type {Queue.<Module>}
             */
            this.processingModuleQueue                  = new Queue();

            /**
             * @private
             * @type {Set.<IocModule>}
             */
            this.registeredIocModuleSet                 = new Set();

            /**
             * @private
             * @type {Set.<IModuleProcessor>}
             */
            this.registeredModuleProcessorSet           = new Set();

            /**
             * @private
             * @type {boolean}
             */
            this.starting                               = false;


            //-------------------------------------------------------------------------------
            // Setup
            //-------------------------------------------------------------------------------

            this.contextStateMachine.setParentPropagator(this);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {IocDefines.ContextState|string}
         */
        getContextState: function() {
            return this.contextStateMachine.getCurrentState();
        },

        /**
         * @return {boolean}
         */
        getGenerated: function() {
            return this.generated;
        },

        /**
         * @return {boolean}
         */
        getStarting: function() {
            return this.starting;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isGenerated: function() {
            return this.getGenerated();
        },

        /**
         * @return {boolean}
         */
        isReady: function() {
            return this.getContextState() === IocDefines.ContextState.READY;
        },

        /**
         * @return {boolean}
         */
        isRunning: function() {
            return this.getContextState() === IocDefines.ContextState.RUNNING;
        },

        /**
         * @return {boolean}
         */
        isStarting: function() {
            return this.getStarting();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} name
         * @return {IocModule}
         */
        findIocModuleByName: function(name) {
            return this.moduleNameToIocModuleMap.get(name);
        },

        /**
         *
         */
        generate: function() {
            if (!this.generated) {
                this.generated = true;
                this.generateModules();
                this.contextStateMachine.changeState(IocDefines.ContextState.READY);
            }
        },

        /**
         * @param {string} moduleName
         * @return {Module}
         */
        generateModuleByName: function(moduleName) {
            var iocModule = this.findIocModuleByName(moduleName);
            return this.generateModule(iocModule);
        },

        /**
         * @param {function(Throwable=)} callback
         */
        start: function(callback) {
            var commands = [
                this.contextCommandFactory.factoryStartContextCommand(this)
            ];
            this.commandProcessor.processCommands(commands, callback);
        },

        /**
         * @param {function(Throwable=)} callback
         */
        stop: function(callback) {
            var commands = [
                this.contextCommandFactory.factoryStopContextCommand(this)
            ];
            this.commandProcessor.processCommands(commands, callback);
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
                this.registerModuleDependencies(iocModule);
                console.log("IocModule registered - name:" + iocModule.getName());
            }
        },

        /**
         * @param {IModuleProcessor} moduleProcessor
         */
        registerModuleProcessor: function(moduleProcessor) {
            if (!Class.doesImplement(moduleProcessor, IModuleProcessor)) {
                throw new Exception("IllegalArgument", {}, "parameter 'moduleProcessor' must implement IModuleProcessor");
            }
            if (!this.registeredModuleProcessorSet.contains(moduleProcessor)) {
                this.registeredModuleProcessorSet.add(moduleProcessor);
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
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
         * @protected
         * @param {function(Throwable=)} callback
         */
        deprocessModules: function(callback) {

        },

        /**
         * @protected
         * @param {function(Throwable=)} callback
         */
        initializeModules: function(callback) {
            var _this = this;
            /** @type {List.<string>} */
            var moduleNamesInDependentOrder = this.dependencyGraph.getValuesInDependentOrder();
            moduleNamesInDependentOrder.forEach(function(moduleName) {
                var iocModule = this.findIocModuleByName(moduleName);
                _this.configureIocModule(iocModule);
            });
            $iterableSeries(this.initializingModuleSet.clone(), function(flow, module) {
                module.initializeModule(function(throwable) {
                    _this.initializingModuleSet.remove(module);
                    _this.initializedModuleSet.add(module);
                    flow.complete(throwable);
                });
            }).execute(callback);
        },

        /**
         * @protected
         * @param {function(Throwable=)} callback
         */
        processModules: function(callback) {
            //TODO BRN: Get all module processors
        },

        startContext: function() {
            var _this = this;
            $series([
                $task(function(flow) {
                    _this.processModules(function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.initializeModules(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(callback);
        },

        stopContext: function() {
            var _this = this;
            $series([
                $task(function(flow) {
                    _this.deinitializeModules(function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.deprocessModules(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(callback);
        },

        /**
         * @protected
         * @param {(IocDefines.ContextState|string)} contextState
         */
        updateContextState: function(contextState) {
            this.contextStateMachine.changeState(contextState);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {ModuleProcessorTag} moduleProcessorTag
         * @param {Object} context
         * @return {IModuleProcessor}
         */
        buildModuleProcessor: function(moduleProcessorTag, context) {
            var processingMethodName    = moduleProcessorTag.getMethodName();
            var processingMethod        = context[processingMethodName];
            var moduleProcessor         = this.factoryModuleProcessor(processingMethod, context);
            this.registerModuleProcessor(moduleProcessor);
            return moduleProcessor;
        },

        /**
         * @private
         * @param {Module} module
         */
        checkIfModuleIsModuleProcessor: function(module) {
            var _this = this;
            if (Class.doesImplement(module.getInstance(), IModuleProcessor)) {
                this.registerModuleProcessor(module.getInstance());
            } else {
                var moduleClass     = module.getInstance().getClass();
                var moduleTags      = bugmeta.getTagsByReference(moduleClass);
                moduleTags.forEach(function(moduleTag) {
                    if (Class.doesExtend(moduleTag, ModuleProcessorTag)) {
                        _this.buildModuleProcessor(moduleTag, module);
                    }
                });
            }
        },

        /**
         * @private
         * @param {Module} module
         */
        configureModule: function(module) {
            if (!module.isConfigured()) {
                module.configure();
                this.processingModuleQueue.enqueue(module);
                this.checkIfModuleIsModuleProcessor(module);
                this.invalidateModules();
            }
        },

        /**
         * @protected
         * @param {function(*)} method
         * @param {Object} context
         * @returns {MethodModuleProcessor}
         */
        factoryModuleProcessor: function(method, context) {
            return new MethodModuleProcessor(method, context);
        },

        /**
         * @private
         * @param {IocModule} iocModule
         * @return {ModuleScope}
         */
        factoryModuleScope: function(iocModule) {
            var scope = null;
            switch (iocModule.getScope()) {
                case IocModule.Scope.PROTOTYPE:
                    scope = new PrototypeModuleScope(this, iocModule);
                    break;
                case IocModule.Scope.SINGLETON:
                    scope = new SingletonModuleScope(this, iocModule);
                    break;
            }
            return scope;
        },

        /**
         * @param {IocModule} iocModule
         * @return {ModuleScope}
         */
        findModuleScopeByIocModule: function(iocModule) {
            return this.iocModuleToModuleScopeMap.get(iocModule);
        },

        /**
         * @private
         * @param {IocModule} iocModule
         * @return {Module}
         */
        generateModule: function(iocModule) {
            var scope       = this.generateModuleScope(iocModule);
            var module      = scope.generateModule();
            this.generatedModuleSet.add(module);
            this.configureModule(module);
            return module;
        },

        /**
         * @private
         */
        generateModules: function() {
            var _this = this;
            /** @type {List.<string>} */
            var moduleNamesInDependentOrder = this.dependencyGraph.getValuesInDependentOrder();
            moduleNamesInDependentOrder.forEach(function(moduleName) {
                _this.generateModuleByName(moduleName);
            });
        },

        /**
         * @private
         * @param {IocModule} iocModule
         * @return {ModuleScope}
         */
        generateModuleScope: function(iocModule) {
            var scope = this.findModuleScopeByIocModule(iocModule);
            if (!scope) {
                scope = this.factoryModuleScope(iocModule);
                this.iocModuleToModuleScopeMap.put(iocModule, scope);
            }
            return scope;
        },

        /**
         * @private
         * @param {Module} module
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(module, callback) {

        },

        invalidateModules: function() {
            Func.deferCall(function() {}, {}, [])
        },

        processModule: function(module, callback) {
            if (Class.doesImplement(module, IInitializeModule)) {
                this.initializingModuleSet.add(module);
            }
        },

        /**
         * @private
         * @param {IocModule} iocModule
         */
        registerModuleDependencies: function(iocModule) {
            var _this = this;
            var moduleName = iocModule.getName();
            this.dependencyGraph.addNodeForValue(moduleName);
            var iocArgList = iocModule.getIocArgList();
            iocArgList.forEach(function(iocArg) {
                if (iocArg.getRef()) {
                    _this.dependencyGraph.addDependency(moduleName, iocArg.getRef());
                }
            });
            var iocPropertySet = iocModule.getIocPropertySet();
            iocPropertySet.forEach(function(iocProperty) {
                if (iocProperty.getRef()) {
                    _this.dependencyGraph.addDependency(moduleName, iocProperty.getRef());
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.IocContext', IocContext);
});
