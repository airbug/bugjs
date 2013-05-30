//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MessageRoute')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('MessageReceiver')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventDispatcher     = bugpack.require('EventDispatcher');
var MessageReceiver     = bugpack.require('MessageReceiver');
var Set                 = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageRoute = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(messagePropagator) {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Set.<string>}
         */
        this.addressSet = new Set();

        /**
         * @private
         * @type {boolean}
         */
        this.initialized = false;

        /**
         * @private
         * @type {MessagePropagator}
         */
        this.messagePropagator = messagePropagator;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Set.<string>}
     */
    getAddressSet: function() {
        return this.addressSet;
    },

    /**
     * @return {MessagePropagator}
     */
    getMessagePropagator: function() {
        return this.messagePropagator;
    },

    /**
     * @return {boolean}
     */
    isInitialized: function() {
        return this.initialized;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    deinitialize: function() {
        if (this.isInitialized()) {
            this.initialized = false;
            this.messagePropagator.removeEventPropagator(this);
            this.removeEventListener(MessageReceiver.EventTypes.ADDRESS_DEREGISTERED, this.hearAddressDeregisteredEvent, this);
            this.removeEventListener(MessageReceiver.EventTypes.ADDRESS_REGISTERED, this.hearAddressRegisteredEvent, this);
        }
    },

    /**
     *
     */
    initialize: function() {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.messagePropagator.addEventPropagator(this);
            this.addEventListener(MessageReceiver.EventTypes.ADDRESS_DEREGISTERED, this.hearAddressDeregisteredEvent, this);
            this.addEventListener(MessageReceiver.EventTypes.ADDRESS_REGISTERED, this.hearAddressRegisteredEvent, this);
        }
    },

    /**
     * @param {Message} message
     * @param {string} channel
     */
    routeMessage: function(message, channel) {
        this.messagePropagator.propagateMessage(message, channel);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} address
     */
    deregisterAddress: function(address) {
        if (this.addressSet.contains(address)) {
            this.addressSet.remove(address);
        }
    },

    /**
     * @private
     * @param {string} address
     */
    registerAddress: function(address) {
        if (!this.addressSet.contains(address)) {
            this.addressSet.add(address);
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
        var address = event.getData().address;
        this.deregisterAddress(address);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearAddressRegisteredEvent: function(event) {
        var address = event.getData().address;
        this.registerAddress(address);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('MessageRoute', MessageRoute);
