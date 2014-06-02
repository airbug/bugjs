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

//@Export('carapace.ControllerTagProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugmeta.ITagProcessor')
//@Require('carapace.ControllerRoute')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var Set                 = bugpack.require('Set');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var ITagProcessor       = bugpack.require('bugmeta.ITagProcessor');
    var ControllerRoute     = bugpack.require('carapace.ControllerRoute');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {ITagProcessor}
     */
    var ControllerTagProcessor = Class.extend(Obj, {

        _name: "carapace.ControllerTagProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {CarapaceApplication} carapaceApplication
         */
        _constructor: function(carapaceApplication) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CarapaceApplication}
             */
            this.carapaceApplication = carapaceApplication;


            /**
             * @private
             * @type {Set.<ControllerTag>}
             */
            this.processedControllerTagSet   = new Set();
        },


        //-------------------------------------------------------------------------------
        // ITagProcessor Implementation
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @param {Tag} tag
         */
        process: function(tag) {
            this.processControllerTag(/** @type {ControllerTag} */(tag));
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Class} controllerClass
         * @param {string} controllerRoute
         */
        createController: function(controllerClass, controllerRoute) {
            var controllerConstructor   = controllerClass.getConstructor();
            var controller              = /** @type {CarapaceController} */(new controllerConstructor());
            this.carapaceApplication.registerController(controller);
            this.carapaceApplication.registerControllerRoute(new ControllerRoute(controllerRoute, controller));
        },

        /**
         * @private
         * @param {ControllerTag} controllerTag
         */
        processControllerTag: function(controllerTag) {
            if (!this.processedControllerTagSet.contains(controllerTag)) {
                this.processedControllerTagSet.add(controllerTag);
                var controllerConstructor   = controllerTag.getTagReference();
                var controllerClass         = controllerConstructor.getClass();
                var controllerRoute         = controllerTag.getRoute();
                this.createController(controllerClass, controllerRoute);
            }
        }
    });



    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(ControllerTagProcessor, ITagProcessor);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ControllerTagProcessor).with(
        module("controllerTagProcessor")
            .args([
                arg().ref("carapaceApplication")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcontroller.ControllerTagProcessor', ControllerTagProcessor);
});
