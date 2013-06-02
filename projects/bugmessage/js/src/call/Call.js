//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Call')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('bugmessage.IMessageSender')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Event           = bugpack.require('Event');
var EventDispatcher = bugpack.require('EventDispatcher');
var List            = bugpack.require('List');
var Map             = bugpack.require('Map');
var Obj             = bugpack.require('Obj');
var IMessageSender  = bugpack.require('bugmessage.IMessageSender');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends EventDispatcher
 */
var Call = Class.extend(Obj, {

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
         * @type {boolean}
         */
        this.cleanedUp = false;

        /**
         * @private
         * @type {IMessageChannel}
         */
        this.outGoingMessageChannel = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {IMessageChannel}
     */
    getOutGoingMessageChannel: function() {
        return this.outGoingMessageChannel;
    },

    /**
     * @param {IMessageChannel} outGoingMessageChannel
     */
    setOutGoingMessageChannel: function(outGoingMessageChannel) {
        this.outGoingMessageChannel = outGoingMessageChannel;
    },


    //-------------------------------------------------------------------------------
    // IMessageSender Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} incomingMessage
     * @param {MessageResponder} messageResponder
     */
    channelMessage: function(incomingMessage, messageResponder) {
        if (channel === "error") {
            this.dispatchEvent(new Event(Call.EventTypes.ERROR, {
                message: incomingMessage,
                error: incomingMessage.getData().error
            }));
        } else {
            this.dispatchEvent(new Event(Call.EventTypes.MESSAGE, {
                message: message,
                channel: channel
            }));
        }
    },


    //-------------------------------------------------------------------------------
    // IMessageGateway Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {IMessageChannel} messageChannel
     */
    sendMessage: function(message, channel) {
        this.outGoingMessageChannel.channelMessage(message, channel);
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
