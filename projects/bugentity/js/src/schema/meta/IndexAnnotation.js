//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugentity.IndexAnnotation')

//@Require('Class')
//@Require('bugmeta.Annotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Annotation      = bugpack.require('bugmeta.Annotation');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Annotation}
 */
var IndexAnnotation = Class.extend(Annotation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(propertyObject) {

        this._super("Index");


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Object}
         */
        this.indexPropertyObject        = propertyObject;

        /**
         * @private
         * @type {boolean}
         */
        this.indexUnique                = false;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getIndexPropertyObject: function() {
        return this.indexPropertyObject;
    },

    /**
     * @return {boolean}
     */
    getIndexUnique: function() {
        return this.indexUnique;
    },


    //-------------------------------------------------------------------------------
    // Convenience Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isIndexUnique: function() {
        return this.indexUnique;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} unique
     * @return {IndexAnnotation}
     */
    unique: function(unique) {
        this.indexUnique = unique;
        return this;
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {Object} propertyObject
 * @return {IndexAnnotation}
 */
IndexAnnotation.index = function(propertyObject) {
    return new IndexAnnotation(propertyObject);
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.IndexAnnotation', IndexAnnotation);
