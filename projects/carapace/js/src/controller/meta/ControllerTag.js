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

//@Export('carapace.ControllerTag')

//@Require('Class')
//@Require('bugmeta.Tag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Tag      = bugpack.require('bugmeta.Tag');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Tag}
     */
    var ControllerTag = Class.extend(Tag, {

        _name: "carapace.ControllerTag",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super(ControllerTag.TYPE);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.controllerRoute = "";
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getRoute: function() {
            return this.controllerRoute;
        },


        //-------------------------------------------------------------------------------
        // Class Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} controllerCatch
         */
        'catch': function(controllerCatch) {
            //TODO BRN
        },

        /**
         * @param {string} controllerRoute
         */
        route: function(controllerRoute) {
            this.controllerRoute = controllerRoute;
            return this;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {string}
     */
    ControllerTag.TYPE = "CarapaceController";


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @return {ControllerTag}
     */
    ControllerTag.controller = function() {
        return new ControllerTag();
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('carapace.ControllerTag', ControllerTag);
});
