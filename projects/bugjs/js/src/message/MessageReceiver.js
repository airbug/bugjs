//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MessageReceiver')

//@Require('Class')
//@Require('IMessageReceiver')
//@Require('Obj')
//@Require('UuidGenerator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IMessageReceiver    = bugpack.require('IMessageReceiver');
var Obj                 = bugpack.require('Obj');
var UuidGenerator       = bugpack.require('UuidGenerator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageReceiver = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(receiverFunction, receiverContext) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.address = UuidGenerator.generateUuid();

        /**
         * @private
         * @type {Object}
         */
        this.receiverContext = receiverContext;

        /**
         * @private
         * @type {function(Message)}
         */
        this.receiverFunction = receiverFunction;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getReceiverContext: function() {
        return this.receiverContext;
    },

    /**
     * @return {function(Message)}
     */
    getReceiverFunction: function() {
        return this.receiverFunction;
    },


    //-------------------------------------------------------------------------------
    // IMessageReceiver Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getAddress: function() {
        return this.address;
    },

    /**
     * @param {Message} message
     * @param {string} channel
     */
    receiveMessage: function(message, channel) {
        if (!message) {
            throw new Error("message must be specified. message:" + message);
        }
        if (!channel) {
            throw new Error("channel must be specified. channel:" + channel);
        }
        this.receiverFunction.call(this.receiverContext, message, channel);
    },


    //-------------------------------------------------------------------------------
    // Obj Extension
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, MessageReceiver)) {
            return (
                value.getReceiverFunction() === this.receiverFunction &&
                value.getReceiverContext() === this.receiverContext
            );
        }
        return false;
    },

    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[MessageReceiver]" +
                Obj.hashCode(this.receiverFunction) + "_" +
                Obj.hashCode(this.receiverContext));
        }
        return this._hashCode;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MessageReceiver, IMessageReceiver);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('MessageReceiver', MessageReceiver);
