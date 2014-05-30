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

//@Export('bugentity.EntityAnnotation')

//@Require('Class')
//@Require('bugmeta.Annotation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Annotation  = bugpack.require('bugmeta.Annotation');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @type {function(new:Constructor)}
     */
    var EntityAnnotation = Class.extend(Annotation, {

        _name: "ugentity.EntityAnnotation",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} entityName
         */
        _constructor: function(entityName) {

            this._super(EntityAnnotation.TYPE);


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
             * @type {Array.<IndexAnnotation>}
             */
            this.entityIndexArray       = [];

            /**
             * @private
             * @type {string}
             */
            this.entityName             = entityName;

            /**
             * @private
             * @type {Array.<PropertyAnnotation>}
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
         * @return {Array.<IndexAnnotation>}
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
         * @return {Array.<PropertyAnnotation>}
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
         * @return {EntityAnnotation}
         */
        embed: function(embedded) {
            this.entityEmbedded = embedded;
            return this;
        },

        /**
         * @param {Array.<IndexAnnotation>} indexArray
         * @return {EntityAnnotation}
         */
        indexes: function(indexArray) {
            this.entityIndexArray = indexArray;
            return this;
        },

        /**
         * @param {Array.<PropertyAnnotation>} propertyArray
         * @return {EntityAnnotation}
         */
        properties: function(propertyArray) {
            this.entityPropertyArray = propertyArray;
            return this;
        },

        /**
         * @param {boolean} stored
         * @return {EntityAnnotation}
         */
        store: function(stored) {
            this.entityStored = stored;
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
    EntityAnnotation.TYPE   = "Entity";


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} entityName
     * @return {EntityAnnotation}
     */
    EntityAnnotation.entity = function(entityName) {
        return new EntityAnnotation(entityName);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.EntityAnnotation', EntityAnnotation);
});
