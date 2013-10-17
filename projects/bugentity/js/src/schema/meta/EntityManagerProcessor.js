//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityManagerProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('bugentity.EntityManagerScan')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var EntityManagerScan       = bugpack.require('bugentity.EntityManagerScan');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityManagerProcessor = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(entityManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {EntityManager}
         */
        this.entityManager  = entityManager;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Class} entityManagerClass
     */
    scanClass: function(entityManagerClass) {
        var entityManagerScan = new EntityManagerScan();
        var entityManagerAnnotation = entityManagerScan.scanClass(entityManagerClass);
        if (entityManagerAnnotation) {
            this.process(entityManagerAnnotation);
        } else {
            throw new Error("Could not find EntityManager annotation for class - class:", entityManagerClass);
        }
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {EntityManagerAnnotation} entityManagerAnnotation
     */
    process: function(entityManagerAnnotation) {
        var entityType          = entityManagerAnnotation.getEntityType();
        if (entityType) {
            this.entityManager.setEntityType(entityType);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityManagerProcessor', EntityManagerProcessor);
