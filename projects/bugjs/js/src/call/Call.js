//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Call')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('IMessageReceiver')
//@Require('IMessageSender')
//@Require('List')
//@Require('Map')
//@Require('MessageReceiver')
//@Require('UuidGenerator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Event               = bugpack.require('Event');
var EventDispatcher     = bugpack.require('EventDispatcher');
var IMessageReceiver    = bugpack.require('IMessageReceiver');
var IMessageSender      = bugpack.require('IMessageSender');
var List                = bugpack.require('List');
var Map                 = bugpack.require('Map');
var MessageSender       = bugpack.require('MessageReceiver');
var UuidGenerator       = bugpack.require('UuidGenerator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends EventDispatcher
 * @implements IMessageReceiver
 */
var Call = Class.extend(EventDispatcher, {

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
         * @type {boolean}
         */
        this.cleanedUp = false;

        /**
         * @private
         * @type {MessageReceiver}
         */
        this.messageReceiver = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getAddress: function() {
        return this.address;
    },

    /**
     * @return {*}
     */
    getMessageReceiver: function() {
        return this.messageReceiver;
    },

    /**
     * @param {MessageReceiver} messageReceiver
     */
    setMessageReceiver: function(messageReceiver) {
        this.messageReceiver = messageReceiver;
    },


    //-------------------------------------------------------------------------------
    // IMessageReceiver Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {string} channel
     */
    receiveMessage: function(message, channel) {
        if (channel === "error") {
            this.dispatchEvent(new Event(Call.EventTypes.ERROR, {
                message: message,
                error: message.getData().error,
                channel: channel
            }));
        } else {
            this.dispatchEvent(new Event(Call.EventTypes.MESSAGE, {
                message: message,
                channel: channel
            }));
        }
    },


    //-------------------------------------------------------------------------------
    // IMessageSender Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {string} channel
     */
    sendMessage: function(message, channel) {
        message.setReturnAddress(this.address);
        this.messageReceiver.receiveMessage(message, channel);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    cleanup: function() {
        if (!this.cleanedUp) {
            this.cleanedUp = true;
            this.dispatchEvent(new Event(Call.EventTypes.CLEANUP));
            this.removeAllListeners();
        }
    },

    /**
     * @param {function(Event)} listenerFunction
     * @param {Object} listenerContext
     */
    onMessage: function(listenerFunction, listenerContext) {
        this.addEventListener(Call.EventTypes.MESSAGE, listenerFunction, listenerContext);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Call, IMessageReceiver);
Class.implement(Call, IMessageSender);


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
Call.EventTypes = {
    CLEANUP: 'Call:Cleanup',
    ERROR: 'Call:Error',
    MESSAGE: 'Call:Message'
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('Call', Call);
