//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MessageRouter')

//@Require('Class')
//@Require('IMessagePropagator')
//@Require('Map')
//@Require('MessagePropagator')
//@Require('MessageReceiver')
//@Require('MessageRoute')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IMessagePropagator  = bugpack.require('IMessagePropagator');
var Map                 = bugpack.require('Map');
var MessagePropagator   = bugpack.require('MessagePropagator');
var MessageReceiver     = bugpack.require('MessageReceiver');
var MessageRoute        = bugpack.require('MessageRoute');
var Obj                 = bugpack.require('Obj');
var Set                 = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageRouter = Class.extend(MessagePropagator, {

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
         * @type {Map.<string, MessageRoute>}
         */
        this.messageAddressToMessageRouteMap = new Map();

        /**
         * @private
         * @type {Set.<MessagePropagator>}
         */
        this.messagePropagatorSet = new Set();

        /**
         * @private
         * @type {Map.<MessagePropagator, MessageRoute>}
         */
        this.messagePropagatorToMessageRouteMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // IMessagePropagator Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {string} channel
     */
    propagateMessage: function(message, channel) {
        var messageRoute = this.messageAddressToMessageRouteMap.get(message.getReceiverAddress());
        if (messageRoute) {
            messageRoute.routeMessage(message, channel);
        }
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MessagePropagator} messagePropagator
     * @return {boolean}
     */
    addMessagePropagator: function(messagePropagator) {
        if (!this.messagePropagatorSet.contains(messagePropagator)) {
            this.messagePropagatorSet.add(messagePropagator);
            this.addMessageRouteForPropagator(messagePropagator);
            return true;
        }
        return false;
    },

    /**
     * @param {MessagePropagator} messagePropagator
     * @return {boolean}
     */
    hasMessagePropagator:function(messagePropagator) {
        return this.messagePropagatorSet.contains(messagePropagator);
    },

    /**
     * @param {MessagePropagator} messagePropagator
     * @return {boolean}
     */
    removeMessagePropagator: function(messagePropagator) {
        if (this.messagePropagatorSet.contains(messagePropagator)) {
            this.messagePropagatorSet.remove(messagePropagator);
            return true;
        }
        return false;
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {MessagePropagator} messagePropagator
     */
    addMessageRouteForPropagator: function(messagePropagator) {
        var messageRoute = new MessageRoute(messagePropagator);
        messageRoute.addEventListener(MessageReceiver.EventTypes.ADDRESS_DEREGISTERED, this.hearAddressDeregisteredEvent, this);
        messageRoute.addEventListener(MessageReceiver.EventTypes.ADDRESS_REGISTERED, this.hearAddressRegisteredEvent, this);
        messageRoute.initialize();
        messageRoute.addEventPropagator(this);
        this.messagePropagatorToMessageRouteMap.put(messagePropagator, messageRoute);
    },

    /**
     * @private
     * @param {MessagePropagator} messagePropagator
     */
    removeMessageRouteForPropagator: function(messagePropagator) {
        var _this = this;
        var messageRoute = this.messagePropagatorToMessageRouteMap.get(messagePropagator);
        messageRoute.deinitialize();
        messageRoute.removeEventListener(MessageReceiver.EventTypes.ADDRESS_DEREGISTERED, this.hearAddressDeregisteredEvent, this);
        messageRoute.removeEventListener(MessageReceiver.EventTypes.ADDRESS_REGISTERED, this.hearAddressRegisteredEvent, this);
        var addressSet = messageRoute.getAddressSet();
        addressSet.forEach(function(address) {
            _this.deregisterAddressWithMessageRoute(address, messageRoute);
        });
        messageRoute.removeEventPropagator(this);
        this.messagePropagatorToMessageRouteMap.remove(messagePropagator);
    },

    /**
     * @private
     * @param {string} address
     * @param {MessageRoute} messageRoute
     */
    registerAddressWithMessageRoute: function(address, messageRoute) {
        var currentMessageRoute = this.messageAddressToMessageRouteMap.get(address);
        if (!currentMessageRoute) {
            this.messageAddressToMessageRouteMap.put(address, messageRoute);
        } else {
            throw new Error("MessageRoute already exists for address '" + address + "'");
        }
    },

    /**
     * @private
     * @param {string} address
     * @param {MessageRoute} messageRoute
     */
    deregisterAddressWithMessageRoute: function(address, messageRoute) {
        var currentMessageRoute = this.messageAddressToMessageRouteMap.get(address);
        if (Obj.equals(currentMessageRoute, messageRoute)) {
            this.messageAddressToMessageRouteMap.remove(address);
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearAddressDeregisteredEvent: function(event) {
        var messageRoute = event.getCurrentTarget();
        var address = event.getData().address;
        this.deregisterAddressWithMessageRoute(address, messageRoute);
        event.stopPropagation();
    },

    /**
     * @private
     * @param {Event} event
     */
    hearAddressRegisteredEvent: function(event) {
        var messageRoute = event.getCurrentTarget();
        var address = event.getData().address;
        this.registerAddressWithMessageRoute(address, messageRoute);
        event.stopPropagation();
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MessageRouter, IMessagePropagator);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('MessageRouter', MessageRouter);
