//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('CarapaceModel')

//@Require('Backbone')
//@Require('Class')
//@Require('HashUtil')
//@Require('IdGenerator')
//@Require('IDisposable')
//@Require('IEquals')
//@Require('IHashCode')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CarapaceModel = Class.adapt(Backbone.Model, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data) {

        this._super(data);

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {number}
         */
        this._internalId = undefined;

        IdGenerator.injectId(this);

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
    // IDisposable Implementation
    //-------------------------------------------------------------------------------

    /**
     *
     */
    dispose: function() {
        if (!this.disposed) {
            this.disposed = true;
            //TODO BRN: Remove all listeners. Reset and eject any data.
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


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------
});
Class.implement(CarapaceModel, IDisposable);
Class.implement(CarapaceModel, IEquals);
Class.implement(CarapaceModel, IHashCode);


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------
