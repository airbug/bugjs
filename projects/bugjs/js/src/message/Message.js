//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Message')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Obj =       bugpack.require('Obj');
var TypeUtil =  bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Message = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(topic, data) {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Object}
         */
        this.data = data;

        /**
         * @private
         * @type {string}
         */
        this.destinationAddress = null;

        /**
         * @private
         * @type {string}
         */
        this.returnAddress = null;

        /**
         * @private
         * @type {string}
         */
        this.topic = TypeUtil.isString(topic) ? topic : "";
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getData: function() {
        return this.data;
    },

    /**
     * @return {string}
     */
    getDestinationAddress: function() {
        return this.destinationAddress;
    },

    /**
     * @param {string} destinationAddress
     */
    setDestinationAddress: function(destinationAddress) {
        this.destinationAddress = destinationAddress;
    },

    /**
     * @return {string}
     */
    getReturnAddress: function() {
        return this.returnAddress;
    },

    /**
     * @param {string} returnAddress
     */
    setReturnAddress: function(returnAddress) {
        this.returnAddress = returnAddress;
    },

    /**
     * @return {string}
     */
    getTopic: function() {
        return this.topic;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        return {
            topic: this.topic,
            data: this.data
        };
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('Message', Message);
