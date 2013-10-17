//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityManagerStore')

//@Require('Class')
//@Require('Obj')
//@Require('Map')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var Map                 = bugpack.require('Map');


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
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityManagerStore', EntityManagerStore);
