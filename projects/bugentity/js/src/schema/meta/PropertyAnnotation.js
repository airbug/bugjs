//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugentity.PropertyAnnotation')

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
var PropertyAnnotation = Class.extend(Annotation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(propertyName) {

        this._super("Property");


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.propertyCollectionOf       = null;

        /**
         * @private
         * @type {*}
         */
        this.propertyDefault            = null;

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
        this.propertyRequired           = false;

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
     * @return {*}
     */
    getPropertyDefault: function() {
        return this.propertyDefault;
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
     * @return {boolean}
     */
    getPropertyRequired: function() {
        return this.propertyRequired;
    },

    /**
     * @return {string}
     */
    getPropertyType: function() {
        return this.propertyType;
    },


    //-------------------------------------------------------------------------------
    // Convenience Methods
    //-------------------------------------------------------------------------------

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
    isPropertyRequired: function() {
        return this.propertyRequired;
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
     * @param {*} propertyDefault
     * @returns {PropertyAnnotation}
     */
    'default': function(propertyDefault) {
        this.propertyDefault = propertyDefault;
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
     * @param {boolean} index
     * @return {PropertyAnnotation}
     */
    index: function(index) {
        this.propertyIndexed = index;
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
     * @param {boolean} required
     * @return {PropertyAnnotation}
     */
    require: function(required) {
        this.propertyRequired = required;
        return this;
    },

    /**
     * @param {boolean} stored
     * @return {PropertyAnnotation}
     */
    store: function(stored) {
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
     * @param {boolean} unique
     * @return {PropertyAnnotation}
     */
    unique: function(unique) {
        this.propertyUnique = unique;
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
