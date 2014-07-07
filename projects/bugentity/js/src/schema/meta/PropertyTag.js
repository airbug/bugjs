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

//@Export('bugentity.PropertyTag')

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

        _name: "bugentity.PropertyTag",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} propertyName
         */
        _constructor: function(propertyName) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.propertyCollectionOf       = null;

            /**
             * @private
             * @type {*}
             */
            this.propertyDefault            = null;

            /**
             * @private
             * @type {boolean}
             */
            this.propertyId                 = false;

            /**
             * @private
             * @type {boolean}
             */
            this.propertyIndexed            = false;

            /**
             * @private
             * @type {string}
             */
            this.propertyName               = propertyName;

            /**
             * @private
             * @type {boolean}
             */
            this.propertyPopulates          = false;

            /**
             * @private
             * @type {boolean}
             */
            this.propertyPrimaryId          = false;

            /**
             * @private
             * @type {boolean}
             */
            this.propertyRequired           = false;

            /**
             * @private
             * @type {boolean}
             */
            this.propertyStored             = true;

            /**
             * @private
             * @type {string}
             */
            this.propertyType               = null;

            /**
             * @private
             * @type {boolean}
             */
            this.propertyUnique             = false;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getPropertyCollectionOf: function() {
            return this.propertyCollectionOf;
        },

        /**
         * @return {*}
         */
        getPropertyDefault: function() {
            return this.propertyDefault;
        },

        /**
         * @return {string}
         */
        getPropertyName: function() {
            return this.propertyName;
        },

        /**
         * @return {boolean}
         */
        getPropertyPopulates: function() {
            return this.propertyPopulates;
        },

        /**
         * @return {boolean}
         */
        getPropertyRequired: function() {
            return this.propertyRequired;
        },

        /**
         * @return {string}
         */
        getPropertyType: function() {
            return this.propertyType;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isPropertyId: function() {
            return this.propertyId;
        },

        /**
         * @return {boolean}
         */
        isPropertyIndexed: function() {
            return this.propertyIndexed;
        },

        /**
         * @return {boolean}
         */
        isPropertyPrimaryId: function() {
            return this.propertyPrimaryId;
        },

        /**
         * @return {boolean}
         */
        isPropertyRequired: function() {
            return this.propertyRequired;
        },

        /**
         * @return {boolean}
         */
        isPropertyStored: function() {
            return this.propertyStored;
        },

        /**
         * @return {boolean}
         */
        isPropertyUnique: function() {
            return this.propertyUnique;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} propertyCollectionOf
         * @return {PropertyTag}
         */
        collectionOf: function(propertyCollectionOf) {
            this.propertyCollectionOf = propertyCollectionOf;
            return this;
        },

        /**
         * @param {*} propertyDefault
         * @returns {PropertyTag}
         */
        'default': function(propertyDefault) {
            this.propertyDefault = propertyDefault;
            return this;
        },

        /**
         * @return {PropertyTag}
         */
        id: function() {
            this.propertyId = true;
            return this;
        },

        /**
         * @param {boolean} index
         * @return {PropertyTag}
         */
        index: function(index) {
            this.propertyIndexed = index;
            return this;
        },

        /**
         * @param {boolean} populates
         * @return {PropertyTag}
         */
        populates: function(populates) {
            this.propertyPopulates = populates;
            return this;
        },

        /**
         * @return {PropertyTag}
         */
        primaryId: function() {
            this.propertyPrimaryId = true;
            return this;
        },

        /**
         * @param {boolean} required
         * @return {PropertyTag}
         */
        require: function(required) {
            this.propertyRequired = required;
            return this;
        },

        /**
         * @param {boolean} stored
         * @return {PropertyTag}
         */
        store: function(stored) {
            this.propertyStored = stored;
            return this;
        },

        /**
         * @param {string} propertyType
         * @return {PropertyTag}
         */
        type: function(propertyType) {
            this.propertyType = propertyType;
            return this;
        },

        /**
         * @param {boolean} unique
         * @return {PropertyTag}
         */
        unique: function(unique) {
            this.propertyUnique = unique;
            return this;
        }
    });


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

    bugpack.export('bugentity.PropertyTag', PropertyTag);
});
