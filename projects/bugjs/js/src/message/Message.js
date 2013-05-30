//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Message')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('UuidGenerator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var TypeUtil        = bugpack.require('TypeUtil');
var UuidGenerator   = bugpack.require('UuidGenerator');


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
        this.uuid = UuidGenerator.generateUuid();

        /**
         * @private
         * @type {string}
         */
        this.receiverAddress = null;

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
    getUuid: function() {
        return this.uuid;
    },

    /**
     * @return {string}
     */
    getReceiverAddress: function() {
        return this.receiverAddress;
    },

    /**
     * @param {string} receiverAddress
     */
    setReceiverAddress: function(receiverAddress) {
        this.receiverAddress = receiverAddress;
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
            data: this.data,
            receiverAddress: this.receiverAddress
        };
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('Message', Message);
