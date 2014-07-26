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
//@Require('Collections')
//@Require('CommandProcessor')
//@Require('DependencyGraph')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Exception')
//@Require('StateMachine')
//@Require('TypeUtil')
//@Require('ValidationMachine')
//@Require('Flows')
//@Require('bugioc.IModuleProcessor')
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
    var Collections             = bugpack.require('Collections');
    var CommandProcessor        = bugpack.require('CommandProcessor');
    var DependencyGraph         = bugpack.require('DependencyGraph');
    var Event                   = bugpack.require('Event');
    var EventDispatcher         = bugpack.require('EventDispatcher');
    var Exception               = bugpack.require('Exception');
    var StateMachine            = bugpack.require('StateMachine');
    var TypeUtil                = bugpack.require('TypeUtil');
    var ValidationMachine       = bugpack.require('ValidationMachine');
    var Flows                 = bugpack.require('Flows');
    var IModuleProcessor        = bugpack.require('bugioc.IModuleProcessor');
    var IocModule               = bugpack.require('bugioc.IocModule');
    var MethodModuleProcessor   = bugpack.require('bugioc.MethodModuleProcessor');
    var ModuleProcessorTag      = bugpack.require('bugioc.ModuleProcessorTag');
    var PrototypeModuleScope    = bugpack.require('bugioc.PrototypeModuleScope');
    var SingletonModuleScope    = bugpack.require('bugioc.SingletonModuleScope');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $iterableSeries         = Flows.$iterableSeries;
    var $series                 = Flows.$series;
    var $task                   = Flows.$task;
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
         * @param {ContextCommandFactory} contextCommandFactory
         */
        _constructor: function(contextCommandFactory) {

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
            this.contextCommandFactory                  = contextCommandFactory;

            /**
             * @private
             * @type {StateMachine}
             */
            this.contextStateMachine                    = new StateMachine({
                initialState: IocContext.ContextState.NOT_READY,
                states: [
                    IocContext.ContextState.NOT_READY,
                    IocContext.ContextState.READY,
                    IocContext.ContextState.RUNNING
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
            this.generatedModuleSet                     = Collections.set();

            /**
             * @private
             * @type {List.<Module>}
             */
            this.initializedModuleList                  = Collections.list();

            /**
             * @private
             * @type {Map.<IocModule, ModuleScope>}
             */
            this.iocModuleToModuleScopeMap              = Collections.map();

            /**
             * @private
             * @type {Map.<string, IocModule>}
             */
            this.moduleNameToIocModuleMap               = Collections.map();

            /**
             * @private
             * @type {ValidationMachine}
             */
            this.moduleValidationMachine                = new ValidationMachine();

            /**
             * @private
             * @type {List.<Module>}
             */
            this.processingModuleList                   = Collections.list();

            /**
             * @private
             * @type {Set.<IocModule>}
             */
            this.registeredIocModuleSet                 = Collections.set();

            /**
             * @private
             * @type {Set.<IModuleProcessor>}
             */
            this.registeredModuleProcessorSet           = Collections.set();

            /**
             * @private
             * @type {boolean}
             */
            this.starting                               = false;
        },


        //-------------------------------------------------------------------------------
        // Initializer
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ContextCommandFactory} contextCommandFactory
         */
        _initializer: function(contextCommandFactory) {
            this._super();
            this.contextStateMachine.setParentPropagator(this);
            this.moduleValidationMachine.addValidator(IocContext.ValidationTypes.MODULES_STARTED, this.validateModulesStarted, this);
            this.moduleValidationMachine.addValidator(IocContext.ValidationTypes.MODULES_STOPPED, this.validateModulesStopped, this);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {IocContext.ContextState|string}
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
            return this.getContextState() === IocContext.ContextState.READY;
        },

        /**
         * @return {boolean}
         */
        isRunning: function() {
            return this.getContextState() === IocContext.ContextState.RUNNING;
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
                this.contextStateMachine.changeState(IocContext.ContextState.READY);
            }
        },

        /**
         * @param {string} moduleName
         * @return {Module}
         */
        generateModuleByName: function(moduleName) {
            var iocModule = this.findIocModuleByName(moduleName);
            if (iocModule) {
                return this.generateModule(iocModule);
            } else {
                throw new Exception("NoModuleForName", {}, "Cannot find IocModule by the name '" + moduleName + "'");
            }
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
         */
        startContext: function() {
            var _this = this;
            this.invalidateModulesStarted(function(throwable) {
                if (!throwable) {
                    _this.contextStateMachine.changeState(IocContext.ContextState.RUNNING);
                } else {
                    _this.dispatchThrowable(throwable);
                }
            });
        },

        /**
         * @protected
         */
        stopContext: function() {
            var _this = this;
            this.invalidateModulesStopped(function(throwable) {
                if (!throwable) {
                    _this.contextStateMachine.changeState(IocContext.ContextState.READY);
                } else {
                    _this.dispatchThrowable(throwable);
                }
            });
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
            var processMethodName       = moduleProcessorTag.getProcessMethodName();
            var processMethod           = null;
            if (processMethodName) {
                processMethod = context[processMethodName];
            }
            var deprocessMethodName     = moduleProcessorTag.getDeprocessMethodName();
            var deprocessMethod         = null;
            if (deprocessMethodName) {
                deprocessMethod = context[deprocessMethodName];
            }
            var moduleProcessor         = this.factoryModuleProcessor(processMethod, deprocessMethod, context);
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
                var instance        = module.getInstance();
                if (TypeUtil.isFunction(instance.getClass)) {
                    var moduleClass = instance.getClass();
                    var moduleTags = bugmeta.getTagsByReference(moduleClass);
                    moduleTags.forEach(function (moduleTag) {
                        if (Class.doesExtend(moduleTag, ModuleProcessorTag)) {
                            _this.buildModuleProcessor(/** @type {ModuleProcessorTag} */(moduleTag), module);
                        }
                    });
                }
            }
        },

        /**
         * @private
         * @param {Module} module
         */
        configureModule: function(module) {
            module.configure();
            this.processingModuleList.add(module);
            this.checkIfModuleIsModuleProcessor(module);
            this.invalidateModulesStarted();
        },

        /**
         * @private
         * @param {Module} module
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(module, callback) {
            var _this = this;
            module.deinitialize(function(throwable) {
                if (!throwable) {
                    _this.initializedModuleList.remove(module);
                }
                callback(throwable);
            });
        },

        /**
         * @private
         * @param {List.<Module>} moduleList
         * @param {function(Throwable=)} callback
         */
        deinitializeModules: function(moduleList, callback) {
            $iterableSeries(moduleList, function(flow, module) {
                module.deinitializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(callback);
        },

        /**
         * @private
         * @param {Module} module
         * @param {function(Throwable=)} callback
         */
        deprocessModule: function(module, callback) {
            var _this = this;
            $iterableSeries(this.registeredModuleProcessorSet, function(flow, moduleProcessor) {
                moduleProcessor.deprocessModule(module, function(throwable) {
                    if (!throwable) {
                        _this.initializedModuleList.remove(module);
                    }
                    flow.complete(throwable);
                });
            }).execute(callback);
        },

        /**
         * @private
         * @param {List.<Module>} moduleList
         * @param {function(Throwable=)} callback
         */
        deprocessModules: function(moduleList, callback) {
            var _this = this;
            $iterableSeries(moduleList, function(flow, module) {
                _this.deprocessModule(module, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(callback);
        },

        /**
         * @private
         * @param {Throwable} throwable
         */
        dispatchThrowable: function(throwable) {
            this.dispatchEvent(new Event(IocContext.EventTypes.THROWABLE, {
                throwable: throwable
            }))
        },

        /**
         * @private
         * @param {Module} module
         */
        doModuleConfiguration: function(module) {
            if (!module.isPreConfigured()) {
                this.preConfigureModule(module);
            }
            if (!module.isConfigured()) {
                this.configureModule(module);
            }
        },

        /**
         * @protected
         * @param {?function(Module)} processMethod
         * @param {?function(Module)} deprocessMethod
         * @param {Object} context
         * @returns {MethodModuleProcessor}
         */
        factoryModuleProcessor: function(processMethod, deprocessMethod, context) {
            return new MethodModuleProcessor(processMethod, deprocessMethod, context);
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
            this.doModuleConfiguration(module);
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
            var _this = this;
            module.initialize(function(throwable) {
                if (!throwable) {
                    _this.initializedModuleList.add(module);
                }
                callback(throwable);
            });
        },

        /**
         * @private
         * @param {List.<Module>} moduleList
         * @param {function(Throwable=)} callback
         */
        initializeModules: function(moduleList, callback) {
            var _this = this;
            $iterableSeries(moduleList, function(flow, module) {
                _this.initializeModule(module, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(callback);
        },

        /**
         * @private
         * @param {function(Throwable=)=} callback
         */
        invalidateModulesStarted: function(callback) {
            this.moduleValidationMachine.invalidate(IocContext.ValidationTypes.MODULES_STARTED, callback);
        },

        /**
         * @private
         * @param {function(Throwable=)=} callback
         */
        invalidateModulesStopped: function(callback) {
            this.moduleValidationMachine.invalidate(IocContext.ValidationTypes.MODULES_STOPPED, callback);
        },

        /**
         * @private
         * @param {Module} module
         */
        preConfigureModule: function(module) {
            module.preConfigure();
            this.wireModuleProperties(module);
        },

        /**
         * @private
         * @param {Module} module
         * @param {function(Throwable=)} callback
         */
        processModule: function(module, callback) {
            $iterableSeries(this.registeredModuleProcessorSet, function(flow, moduleProcessor) {
                moduleProcessor.processModule(module, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(callback);
        },

        /**
         * @private
         * @param {List.<Module>} moduleList
         * @param {function(Throwable=)} callback
         */
        processModules: function(moduleList, callback) {
            var _this = this;
            $iterableSeries(moduleList, function(flow, module) {
                _this.processModule(module, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(callback);
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
        },

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        startModules: function(callback) {
            var _this = this;
            var moduleList = this.processingModuleList.clone();
            this.processingModuleList.clear();
            $series([
                $task(function(flow) {
                    _this.processModules(moduleList, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.initializeModules(moduleList, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(callback);
        },

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        stopModules: function(callback) {
            var _this = this;
            var moduleList = this.initializedModuleList.clone();
            $series([
                $task(function(flow) {
                    _this.deinitializeModules(moduleList, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.deprocessModules(moduleList, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(callback);
        },

        /**
         * @private
         * @param {(IocContext.ContextState|string)} contextState
         */
        updateContextState: function(contextState) {
            this.contextStateMachine.changeState(contextState);
        },

        /**
         * @private
         * @param {Module} module
         */
        wireModuleProperties: function(module) {
            var _this           = this;
            var iocPropertySet  = module.getIocModule().getIocPropertySet();
            var instance        = module.getInstance();
            iocPropertySet.forEach(function(iocProperty) {
                if (iocProperty.getRef()) {

                    instance[iocProperty.getName()] = _this.generateModuleByName(iocProperty.getRef()).getInstance();
                } else {
                    instance[iocProperty.getName()] = iocProperty.getValue();
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Validators
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        validateModulesStarted: function(callback) {
            this.startModules(callback);
        },

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        validateModulesStopped: function(callback) {
            this.stopModules(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    IocContext.ContextState = {
        NOT_READY: "IocContext:State:NotReady",
        READY: "IocContext:State:Ready",
        RUNNING: "IocContext:State:Running"
    };

    /**
     * @static
     * @enum {string}
     */
    IocContext.EventTypes = {
        THROWABLE: "IocContext:EventTypes:Throwable"
    };

    /**
     * @static
     * @enum {string}
     */
    IocContext.ValidationTypes = {
        MODULES_STARTED: "IocContext:ValidationTypes:ModulesStarted",
        MODULES_STOPPED: "IocContext:ValidationTypes:ModulesStopped"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.IocContext', IocContext);
});
