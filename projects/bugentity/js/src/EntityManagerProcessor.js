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

//@Export('bugentity.EntityManagerProcessor')
//@Autoload

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Obj')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerTag')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleProcessorTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var ArgumentBug         = bugpack.require('ArgumentBug');
    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var EntityManager       = bugpack.require('bugentity.EntityManager');
    var EntityManagerTag    = bugpack.require('bugentity.EntityManagerTag');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var ModuleProcessorTag  = bugpack.require('bugioc.ModuleProcessorTag');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;
    var moduleProcessor     = ModuleProcessorTag.moduleProcessor;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var EntityManagerProcessor = Class.extend(Obj, {

        _name: "bugentity.EntityManagerProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MetaContext} metaContext
         * @param {entityManagerStore} entityManagerStore
         * @param {MongoDataStore} entityDataStore
         */
        _constructor: function(metaContext, entityManagerStore, entityDataStore) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MongoDataStore}
             */
            this.entityDataStore        = entityDataStore;

            /**
             * @private
             * @type {EntityManagerStore}
             */
            this.entityManagerStore     = entityManagerStore;

            /**
             * @private
             * @type {MetaContext}
             */
            this.metaContext            = metaContext;

        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {MongoDataStore}
         */
        getEntityDataStore: function() {
            return this.entityDataStore;
        },

        /**
         * @return {EntityManagerStore}
         */
        getEntityManagerStore: function() {
            return this.entityManagerStore;
        },

        /**
         * @return {MetaContext}
         */
        getMetaContext: function() {
            return this.metaContext;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} instance
         * @param {function(Throwable=)} callback
         */
        deprocessEntityManager: function(instance, callback) {
            var _this           = this;
            var instanceClass   = instance.getClass();
            var tags            = this.metaContext.getTagsByReference(instanceClass);
            tags.forEach(function(tag) {
                if (Class.doesExtend(tag, EntityManagerTag)) {
                    _this.deregisterEntityManager(instance);
                }
            });
            callback();
        },


        /**
         * @param {*} instance
         * @param {function(Throwable=)} callback
         */
        processEntityManager: function(instance, callback) {
            var _this           = this;
            var instanceClass   = instance.getClass();
            var tags            = this.metaContext.getTagsByReference(instanceClass);
            tags.forEach(function(tag) {
                if (Class.doesExtend(tag, EntityManagerTag)) {
                    _this.registerEntityManager((/** @type {EntityManagerTag} */(tag)).getEntityType(), instance);
                }
            });
            callback();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {EntityManager} entityManager
         */
        deregisterEntityManager: function(entityManager) {
            this.entityManagerStore.deregisterEntityManager(entityManager);
            entityManager.setDataStore(null);

        },

        /**
         * @private
         * @param {string} entityType
         * @param {EntityManager} entityManager
         */
        registerEntityManager: function(entityType, entityManager) {
            if (Class.doesExtend(entityManager, EntityManager)) {
                entityManager.setEntityType(entityType);
                entityManager.setDataStore(this.entityDataStore.generateManager(entityType));
                this.entityManagerStore.registerEntityManager(entityManager);
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "entityManager", entityManager, "parameter must extend EntityManager");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(EntityManagerProcessor).with(
        module("entityManagerProcessor")
            .args([
                arg().ref("metaContext"),
                arg().ref("entityManagerStore"),
                arg().ref("mongoDataStore")
            ]),
        moduleProcessor()
            .processMethod("processEntityManager")
            .deprocessMethod("deprocessEntityManager")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.EntityManagerProcessor', EntityManagerProcessor);
});
