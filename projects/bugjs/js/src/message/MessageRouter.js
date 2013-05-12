//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MessageRouter')

//@Require('Class')
//@Require('IMessageReceiver')
//@Require('Map')
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
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var UuidGenerator       = bugpack.require('UuidGenerator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageRouter = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

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
         * @type {MessageReceiver}
         */
        this.defualtReceiver = null;

        /**
         * @private
         * @type {Map.<string, IMessageReceiver>}
         */
        this.messageAddressToMessageReceiverMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {IMessageReceiver}
     */
    getDefaultReceiver: function() {
        return this.defualtReceiver;
    },

    /**
     * @param {IMessageReceiver} defaultReceiver
     */
    setDefaultReceiver: function(defaultReceiver) {
        this.defualtReceiver = defaultReceiver;
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
        var messageReceiver = this.messageAddressToMessageReceiverMap.get(message.getDestinationAddress());
        if (messageReceiver) {
            messageReceiver.receiveMessage(message, channel);
        } else if (this.defualtReceiver) {
            this.defualtReceiver.receiveMessage(message, channel);
        }
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {IMessageReceiver} messageReceiver
     * @return {boolean}
     */
    addMessageReceiver: function(messageReceiver) {
        if (!this.messageAddressToMessageReceiverMap.containsKey(messageReceiver.getAddress())) {
            this.messageAddressToMessageReceiverMap.put(messageReceiver.getAddress(), messageReceiver);
            return true;
        }
        return false;
    },

    /**
     * @param {IMessageReceiver} messageReceiver
     * @return {boolean}
     */
    removeMessageReceiver: function(messageReceiver) {
        if (this.messageAddressToMessageReceiverMap.containsKey(messageReceiver.getAddress())) {
            this.messageAddressToMessageReceiverMap.remove(messageReceiver.getAddress());
            return true;
        }
        return false;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MessageRouter, IMessageReceiver);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('MessageRouter', MessageRouter);
