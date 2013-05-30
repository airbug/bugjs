//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Call')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('IMessageGateway')
//@Require('List')
//@Require('Map')
//@Require('MessageDestination')


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
var IMessageGateway     = bugpack.require('IMessageGateway');
var List                = bugpack.require('List');
var Map                 = bugpack.require('Map');
var MessageDestination  = bugpack.require('MessageDestination');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends EventDispatcher
 */
var Call = Class.extend(MessageDestination, {

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
         * @type {IMessagePropagator}
         */
        this.outGoingMessagePropagator = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {IMessagePropagator}
     */
    getOutGoingMessagePropagator: function() {
        return this.outGoingMessagePropagator;
    },

    /**
     * @param {IMessagePropagator} outGoingMessagePropagator
     */
    setOutGoingMessagePropagator: function(outGoingMessagePropagator) {
        this.outGoingMessagePropagator = outGoingMessagePropagator;
    },


    //-------------------------------------------------------------------------------
    // IMessagePropagator Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} incomingMessage
     * @param {string} channel
     */
    propagateMessage: function(incomingMessage, channel) {
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
    // IMessageGateway Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {string} channel
     */
    sendMessage: function(message, channel) {
        this.outGoingMessagePropagator.propagateMessage(message, channel);
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

Class.implement(Call, IMessageGateway);


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
