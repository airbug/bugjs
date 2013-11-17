//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmessage')

//@Export('DestinationRoute')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Set')
//@Require('bugmessage.MessageDestination')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventDispatcher     = bugpack.require('EventDispatcher');
var Set                 = bugpack.require('Set');
var MessageDestination  = bugpack.require('bugmessage.MessageDestination');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DestinationRoute = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(messageChannel) {

        this._super();

        //-------------------------------------------------------------------------------
        // Private Properties
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
         * @type {MessageChannel}
         */
        this.messageChannel = messageChannel;
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
     * @return {MessageChannel}
     */
    getMessageChannel: function() {
        return this.messageChannel;
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
            this.messageChannel.removeEventPropagator(this);
            this.removeEventListener(MessageDestination.EventTypes.ADDRESS_DEREGISTERED, this.hearAddressDeregisteredEvent, this);
            this.removeEventListener(MessageDestination.EventTypes.ADDRESS_REGISTERED, this.hearAddressRegisteredEvent, this);
        }
    },

    /**
     *
     */
    initialize: function() {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.messageChannel.addEventPropagator(this);
            this.addEventListener(MessageDestination.EventTypes.ADDRESS_DEREGISTERED, this.hearAddressDeregisteredEvent, this);
            this.addEventListener(MessageDestination.EventTypes.ADDRESS_REGISTERED, this.hearAddressRegisteredEvent, this);
        }
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

bugpack.export('bugmessage.DestinationRoute', DestinationRoute);
