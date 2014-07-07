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

//@Export('bugdelta.ObjectChange')

//@Require('Class')
//@Require('bugdelta.DeltaChange')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var DeltaChange     = bugpack.require('bugdelta.DeltaChange');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {DeltaChange}
     */
    var ObjectChange = Class.extend(DeltaChange, {

        _name: "bugdelta.ObjectChange",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} changeType
         * @param {string} path
         * @param {string} propertyName
         * @param {*} propertyValue
         * @param {*} previousValue
         */
        _constructor: function(changeType, path, propertyName, propertyValue, previousValue) {

            this._super(changeType, path);


            //-------------------------------------------------------------------------------
            // Properties
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
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getPropertyPath: function() {
            var path = this.getPath() || "";
            if (path) {
                path += "." + this.getPropertyName();
            } else {
                path = this.getPropertyName();
            }
            return path;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    ObjectChange.ChangeTypes = {
        PROPERTY_REMOVED: "ObjectChange:PropertyRemoved",
        PROPERTY_SET: "ObjectChange:PropertySet"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugdelta.ObjectChange', ObjectChange);
});
