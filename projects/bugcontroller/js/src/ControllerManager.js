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

//@Export('bugcontroller.ControllerManager')
//@Autoload

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugcontroller.Controller')
//@Require('bugcontroller.ControllerTag')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgTag')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.ModuleProcessorTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var ArgumentBug         = bugpack.require('ArgumentBug');
    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var Set                 = bugpack.require('Set');
    var Controller          = bugpack.require('bugcontroller.Controller');
    var ControllerTag       = bugpack.require('bugcontroller.ControllerTag');
    var BugFlow             = bugpack.require('bugflow.BugFlow');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var IInitializingModule = bugpack.require('bugioc.IInitializingModule');
    var ModuleProcessorTag  = bugpack.require('bugioc.ModuleProcessorTag');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;
    var moduleProcessor     = ModuleProcessorTag.moduleProcessor;
    var $iterableParallel   = BugFlow.$iterableParallel;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ControllerManager = Class.extend(Obj, {

        _name: "bugcontroller.ControllerManager",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MetaContext} metaContext
         */
        _constructor: function(metaContext) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MetaContext}
             */
            this.metaContext            = metaContext;

            /**
             * @private
             * @type {Set.<Controller>}
             */
            this.registeredControlerSet = new Set();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {MetaContext}
         */
        getMetaContext: function() {
            return this.metaContext;
        },

        /**
         * @return {Set.<Controller>}
         */
        getRegisteredControllerSet: function() {
            return this.registeredControlerSet;
        },


        //-------------------------------------------------------------------------------
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            $iterableParallel(this.registeredControlerSet, function(flow, controller) {
                controller.configure(function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(callback);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} module
         */
        processModuleForController: function(module) {
            var moduleClass = module.getClass();
            var tags        = this.metaContext.getTagsByReference(moduleClass);
            if (tags.contains(ControllerTag)) {
                this.registerController(module);
            }
        },

        /**
         * @param {Controller} controller
         */
        registerController: function(controller) {
            if (Class.doesExtend(controller, Controller)) {
                this.registeredControlerSet.add(controller);
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "controller", controller, "parameter must extend Controller");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(ControllerManager, IInitializingModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ControllerManager).with(
        module("controllerManager")
            .args([
                arg().ref("metaContext")
            ]),
        moduleProcessor().method("")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcontroller.ControllerManager', ControllerManager);
});
