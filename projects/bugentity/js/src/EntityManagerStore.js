//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityManagerStore')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('Map')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var Map                         = bugpack.require('Map');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var module                      = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityManagerStore = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

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

bugmeta.annotate(EntityManagerStore).with(
    module("entityManagerStore")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityManagerStore', EntityManagerStore);
