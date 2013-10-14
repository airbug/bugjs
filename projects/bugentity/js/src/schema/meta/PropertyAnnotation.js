//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('PropertyAnnotation')

//@Require('Class')
//@Require('bugmeta.Annotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Annotation  = bugpack.require('bugmeta.Annotation');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

var PropertyAnnotation = Class.extend(Annotation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(propertyName) {

        this._super("Property");


        //-------------------------------------------------------------------------------
        // Instance Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.propertyId         = false;

        /**
         * @private
         * @type {string}
         */
        this.propertyName       = propertyName;

        /**
         * @private
         * @type {boolean}
         */
        this.propertyIndexed    = false;

        /**
         * @private
         * @type {string}
         */
        this.propertyType       = null;

        /**
         * @private
         * @type {boolean}
         */
        this.propertyUnique     = false;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     *
     * @return {string}
     */
    getName: function() {
        return this.propertyName;
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.propertyType;
    },

    /**
     * @return {boolean}
     */
    isId: function() {
        return this.propertyId;
    },

    /**
     * @return {boolean}
     */
    isIndexed: function() {
        return this.propertyIndexed;
    },

    /**
     * @return {boolean}
     */
    isUnique: function() {
        return this.propertyUnique;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {PropertyAnnotation}
     */
    id: function() {
        this.propertyId = true;
        return this;
    },

    /**
     * @return {PropertyAnnotation}
     */
    index: function() {
        this.propertyIndexed = true;
        return this;
    },

    /**
     * @param {string} propertyType
     * @return {PropertyAnnotation}
     */
    type: function(propertyType) {
        this.propertyType = propertyType;
        return this;
    },

    /**
     * @return {PropertyAnnotation}
     */
    unique: function() {
        this.propertyUnique = true;
        return this;
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {string} propertyName
 * @return {PropertyAnnotation}
 */
PropertyAnnotation.property = function(propertyName) {
    return new PropertyAnnotation(propertyName);
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.PropertyAnnotation', PropertyAnnotation);
