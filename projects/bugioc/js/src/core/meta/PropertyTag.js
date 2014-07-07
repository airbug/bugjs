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

//@Export('bugioc.PropertyTag')

//@Require('Class')
//@Require('bugmeta.Tag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Tag     = bugpack.require('bugmeta.Tag');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Tag}
     */
    var PropertyTag = Class.extend(Tag, {

        _name: "bugioc.PropertyTag",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} propertyName
         */
        _constructor: function(propertyName) {

            this._super(PropertyTag.TYPE);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.propertyName   = propertyName;

            /**
             * @private
             * @type {string}
             */
            this.propertyRef    = null;

            /**
             * @private
             * @type {*}
             */
            this.propertyValue  = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getPropertyName: function() {
            return this.propertyName;
        },

        /**
         * @return {string}
         */
        getPropertyRef: function() {
            return this.propertyRef;
        },

        /**
         * @return {*}
         */
        getPropertyValue: function() {
            return this.propertyValue;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} propertyRef
         * @return {PropertyTag}
         */
        ref: function(propertyRef) {
            this.propertyRef = propertyRef;
            return this;
        },

        /**
         * @param {*} propertyValue
         * @return {PropertyTag}
         */
        value: function(propertyValue) {
            this.propertyValue = propertyValue;
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
    PropertyTag.TYPE = "Property";


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} propertyName
     * @return {PropertyTag}
     */
    PropertyTag.property = function(propertyName) {
        return new PropertyTag(propertyName);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.PropertyTag', PropertyTag);
});
