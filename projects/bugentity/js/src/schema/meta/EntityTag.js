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

//@Export('bugentity.EntityTag')

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
    var EntityTag = Class.extend(Tag, {

        _name: "bugentity.EntityTag",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} entityName
         */
        _constructor: function(entityName) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.entityEmbedded         = false;

            /**
             * @private
             * @type {Array.<IndexTag>}
             */
            this.entityIndexArray       = [];

            /**
             * @private
             * @type {string}
             */
            this.entityName             = entityName;

            /**
             * @private
             * @type {Array.<PropertyTag>}
             */
            this.entityPropertyArray    = [];

            /**
             * @private
             * @type {boolean}
             */
            this.entityStored           = true;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        getEntityEmbedded: function() {
            return this.entityEmbedded;
        },

        /**
         * @return {Array.<IndexTag>}
         */
        getEntityIndexes: function() {
            return this.entityIndexArray;
        },

        /**
         * @return {string}
         */
        getEntityName: function() {
            return this.entityName;
        },

        /**
         * @return {Array.<PropertyTag>}
         */
        getEntityProperties: function() {
            return this.entityPropertyArray;
        },

        /**
         * @return {boolean}
         */
        getEntityStored: function() {
            return this.entityStored;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean} embedded
         * @return {EntityTag}
         */
        embed: function(embedded) {
            this.entityEmbedded = embedded;
            return this;
        },

        /**
         * @param {Array.<IndexTag>} indexArray
         * @return {EntityTag}
         */
        indexes: function(indexArray) {
            this.entityIndexArray = indexArray;
            return this;
        },

        /**
         * @param {Array.<PropertyTag>} propertyArray
         * @return {EntityTag}
         */
        properties: function(propertyArray) {
            this.entityPropertyArray = propertyArray;
            return this;
        },

        /**
         * @param {boolean} stored
         * @return {EntityTag}
         */
        store: function(stored) {
            this.entityStored = stored;
            return this;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} entityName
     * @return {EntityTag}
     */
    EntityTag.entity = function(entityName) {
        return new EntityTag(entityName);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.EntityTag', EntityTag);
});
