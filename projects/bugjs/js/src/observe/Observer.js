//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Observer')

//@Require('Class')
//@Require('Obj')
//@Require('ObjectPathMatcher')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var ObjectPathMatcher   = bugpack.require('ObjectPathMatcher');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var Observer = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} objectPathPattern
     * @param {function(ObservableChange)} observerFunction
     * @param {Object} observerContext
     */
    _constructor: function(objectPathPattern, observerFunction, observerContext) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------


        /**
         * @private
         * @type {string}
         */
        this.objectPathPattern  = objectPathPattern;

        /**
         * @private
         * @type {ObjectPathMatcher}
         */
        this.objectPathMatcher  = new ObjectPathMatcher(this.objectPathPattern);

        /**
         * @private
         * @type {Object}
         */
        this.observerContext    = observerContext;

        /**
         * @private
         * @type {function(ObservableChange)}
         */
        this.observerFunction   = observerFunction;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {ObjectPathMatcher}
     */
    getObjectPathMatcher: function() {
        return this.objectPathMatcher;
    },

    /**
     * @return {string}
     */
    getObjectPathPattern: function() {
        return this.objectPathPattern;
    },

    /**
     * @return {Object}
     */
    getObserverContext: function() {
        return this.observerContext;
    },

    /**
     * @return {function(ObservableChange)}
     */
    getObserverFunction: function() {
        return this.observerFunction;
    },


    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, Observer)) {
            return (Obj.equals(value.getObserverFunction(), this.getObserverFunction()) &&
                Obj.equals(value.getObserverContext(), this.getObserverContext()) &&
                Obj.equals(value.getObjectPathPattern(), this.getObjectPathPattern()));
        }
        return false;
    },

    /**
     * @override
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[Observer]" +
                Obj.hashCode(this.getObserverFunction()) + "_" +
                Obj.hashCode(this.getObserverContext()) + "_" +
                Obj.hashCode(this.getObjectPathPattern()));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} objectPath
     * @returns {boolean}
     */
    match: function(objectPath) {
        return this.objectPathMatcher.match(objectPath);
    },

    /**
     * @param {ObservableChange} change
     */
    observeChange: function(change) {
        this.getObserverFunction().call(this.getObserverContext(), change);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Observer', Observer);
