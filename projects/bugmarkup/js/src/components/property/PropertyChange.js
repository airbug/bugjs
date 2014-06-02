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

//@Export('bugmarkup.PropertyChange')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var PropertyChange = Class.extend(Obj, {

        _name: "bugmarkup.PropertyChange",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} propertyName
         * @param {*} propertyValue
         * @param {*} previousValue
         */
        _constructor: function(propertyName, propertyValue, previousValue) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {*}
             */
            this.previousValue  = previousValue;

            /**
             * @private
             * @type {string}
             */
            this.propertyName   = propertyName;

            /**
             * @private
             * @type {*}
             */
            this.propertyValue  = propertyValue;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        getPreviousValue: function() {
            return this.previousValue;
        },

        /**
         * @return {string}
         */
        getPropertyName: function() {
            return this.propertyName;
        },

        /**
         * @return {*}
         */
        getPropertyValue: function() {
            return this.propertyValue;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmarkup.PropertyChange', PropertyChange);
});
