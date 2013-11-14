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
         * @type {string}
         */
        this.propertyCollectionOf       = null;

        /**
         * @private
         * @type {boolean}
         */
        this.propertyId                 = false;

        /**
         * @private
         * @type {boolean}
         */
        this.propertyIndexed            = false;

        /**
         * @private
         * @type {string}
         */
        this.propertyName               = propertyName;

        /**
         * @private
         * @type {boolean}
         */
        this.propertyPopulates          = false;

        /**
         * @private
         * @type {boolean}
         */
        this.propertyPrimaryId          = false;

        /**
         * @private
         * @type {boolean}
         */
        this.propertyStored             = true;

        /**
         * @private
         * @type {string}
         */
        this.propertyType               = null;

        /**
         * @private
         * @type {boolean}
         */
        this.propertyUnique             = false;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getPropertyCollectionOf: function() {
        return this.propertyCollectionOf;
    },

    /**
     * @return {string}
     */
    getPropertyName: function() {
        return this.propertyName;
    },

    /**
     * @return {boolean}
     */
    getPropertyPopulates: function() {
        return this.propertyPopulates;
    },

    /**
     * @return {string}
     */
    getPropertyType: function() {
        return this.propertyType;
    },

    /**
     * @return {boolean}
     */
    isPropertyId: function() {
        return this.propertyId;
    },

    /**
     * @return {boolean}
     */
    isPropertyIndexed: function() {
        return this.propertyIndexed;
    },

    /**
     * @return {boolean}
     */
    isPropertyPrimaryId: function() {
        return this.propertyPrimaryId;
    },

    /**
     * @return {boolean}
     */
    isPropertyStored: function() {
        return this.propertyStored;
    },

    /**
     * @return {boolean}
     */
    isPropertyUnique: function() {
        return this.propertyUnique;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} propertyCollectionOf
     * @return {PropertyAnnotation}
     */
    collectionOf: function(propertyCollectionOf) {
        this.propertyCollectionOf = propertyCollectionOf;
        return this;
    },

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
     * @param {boolean} populates
     * @return {PropertyAnnotation}
     */
    populates: function(populates) {
        this.propertyPopulates = populates;
        return this;
    },

    /**
     * @return {PropertyAnnotation}
     */
    primaryId: function() {
        this.propertyPrimaryId = true;
        return this;
    },

    /**
     * @param {boolean} stored
     * @return {PropertyAnnotation}
     */
    stored: function(stored) {
        this.propertyStored = stored;
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
