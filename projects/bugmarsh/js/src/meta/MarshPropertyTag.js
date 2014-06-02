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

//@Export('bugmarsh.MarshPropertyTag')

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
    var MarshPropertyTag = Class.extend(Tag, {

        _name: "bugmarsh.MarshPropertyTag",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} propertyName
         * @param {string} getterName
         * @param {string} setterName
         */
        _constructor: function(propertyName, getterName, setterName) {

            this._super(MarshPropertyTag.TYPE);


            //-------------------------------------------------------------------------------
            // Instance Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.getterName                 = getterName;

            /**
             * @private
             * @type {string}
             */
            this.propertyName               = propertyName;

            /**
             * @private
             * @type {string}
             */
            this.setterName                 = setterName;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getGetterName: function() {
            return this.getterName;
        },

        /**
         * @return {string}
         */
        getPropertyName: function() {
            return this.propertyName;
        },

        /**
         * @return {string}
         */
        getSetterName: function() {
            return this.setterName;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} getterName
         * @return {MarshPropertyTag}
         */
        getter: function(getterName) {
            this.getterName = getterName;
            return this;
        },

        /**
         * @param {string} setterName
         * @returns {MarshPropertyTag}
         */
        setter: function(setterName) {
            this.setterName = setterName;
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
    MarshPropertyTag.TYPE    = "MarshProperty";


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} propertyName
     * @return {MarshPropertyTag}
     */
    MarshPropertyTag.property = function(propertyName) {
        return new MarshPropertyTag(propertyName);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmarsh.MarshPropertyTag', MarshPropertyTag);
});
