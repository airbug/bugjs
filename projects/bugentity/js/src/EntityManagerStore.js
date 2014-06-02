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

//@Export('bugentity.EntityManagerStore')
//@Autoload

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Map         = bugpack.require('Map');
    var Obj         = bugpack.require('Obj');
    var ModuleTag   = bugpack.require('bugioc.ModuleTag');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var module      = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var EntityManagerStore = Class.extend(Obj, {

        _name: "bugentity.EntityManagerStore",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<string, EntityManager>}
             */
            this.entityTypeToEntityManagerMap   = new Map();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {EntityManager} entityManager
         */
        deregisterEntityManager: function(entityManager) {
            this.entityTypeToEntityManagerMap.remove(entityManager.getEntityType());
        },

        /**
         * @param {string} entityType
         * @return {EntityManager}
         */
        getEntityManagerByEntityType: function(entityType) {
            return this.entityTypeToEntityManagerMap.get(entityType);
        },

        /**
         * @param {string} entityType
         * @return {boolean}
         */
        hasEntityManagerForEntityType: function(entityType) {
            return this.entityTypeToEntityManagerMap.containsKey(entityType);
        },

        /**
         * @param {EntityManager} entityManager
         */
        registerEntityManager: function(entityManager) {
            if (this.hasEntityManagerForEntityType(entityManager.getEntityType())) {
                throw new Error("EntityManager already registered for entityType - entityType:", entityManager.getEntityType());
            }
            this.entityTypeToEntityManagerMap.put(entityManager.getEntityType(), entityManager);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(EntityManagerStore).with(
        module("entityManagerStore")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.EntityManagerStore', EntityManagerStore);
});
