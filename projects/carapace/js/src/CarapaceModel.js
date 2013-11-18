//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('carapace')

//@Export('CarapaceModel')

//@Require('Class')
//@Require('HashUtil')
//@Require('IdGenerator')
//@Require('IEquals')
//@Require('IHashCode')
//@Require('backbone.Backbone')
//@Require('carapace.IDisposable')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var HashUtil    = bugpack.require('HashUtil');
var IdGenerator = bugpack.require('IdGenerator');
var IEquals     = bugpack.require('IEquals');
var IHashCode   = bugpack.require('IHashCode');
var Backbone    = bugpack.require('backbone.Backbone');
var IDisposable = bugpack.require('carapace.IDisposable');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CarapaceModel = Class.adapt(Backbone.Model, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(attributes, options) {

        this._super(attributes, options);

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {number}
         */
        this._internalId = undefined;

        IdGenerator.ensureId(this);

        /**
         * @private
         * @type {number}
         */
        this._hashCode = undefined;

        /**
         * @private
         * @type {boolean}
         */
        this.disposed = false;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isDisposed: function() {
        return this.disposed;
    },


    //-------------------------------------------------------------------------------
    // IDisposable Implementation
    //-------------------------------------------------------------------------------

    /**
     *
     */
    dispose: function() {
        if (!this.disposed) {
            this.disposed = true;
            this.unbind();
            //TODO BRN: Reset and eject any data.
        }
    },


    //-------------------------------------------------------------------------------
    // IEquals Implementation
    //-------------------------------------------------------------------------------

    /**
     * If two Objs are equal then they MUST return the same hashCode. Otherwise the world will end!
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (value !== null && value !== undefined) {
            return (value._internalId === this._internalId);
        }
        return false;
    },


    //-------------------------------------------------------------------------------
    // IHashCode Implementation
    //-------------------------------------------------------------------------------

    /**
     * Equal hash codes do not necessarily guarantee equality.
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = HashUtil.hash(this);
        }
        return this._hashCode;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(CarapaceModel, IDisposable);
Class.implement(CarapaceModel, IEquals);
Class.implement(CarapaceModel, IHashCode);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('carapace.CarapaceModel', CarapaceModel);
