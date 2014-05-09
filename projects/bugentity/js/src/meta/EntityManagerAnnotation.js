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

//@Export('bugentity.EntityManagerAnnotation')

//@Require('Class')
//@Require('bugioc.ModuleAnnotation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ModuleAnnotation}
     */
    var EntityManagerAnnotation = Class.extend(ModuleAnnotation, {

        _name: "bugentity.EntityManagerAnnotation",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} moduleName
         */
        _constructor: function(moduleName) {

            this._super(moduleName, EntityManagerAnnotation.TYPE);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.entityType     = "";
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getEntityType: function() {
            return this.entityType;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} entityType
         * @return {EntityManagerAnnotation}
         */
        ofType: function(entityType) {
            this.entityType = entityType;
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
    EntityManagerAnnotation.TYPE = "EntityManager";


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} moduleName
     * @return {EntityManagerAnnotation}
     */
    EntityManagerAnnotation.entityManager = function(moduleName) {
        return new EntityManagerAnnotation(moduleName);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.EntityManagerAnnotation', EntityManagerAnnotation);
});
