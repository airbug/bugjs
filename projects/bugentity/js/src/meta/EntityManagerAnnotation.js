//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityManagerAnnotation')

//@Require('Class')
//@Require('bugioc.ModuleAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityManagerAnnotation = Class.extend(ModuleAnnotation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(moduleName) {

        this._super(moduleName, "EntityManager");


        //-------------------------------------------------------------------------------
        // Declare Variables
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
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @return {EntityManagerAnnotation}
 */
EntityManagerAnnotation.entityManager = function() {
    return new EntityManagerAnnotation();
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityManagerAnnotation', EntityManagerAnnotation);
