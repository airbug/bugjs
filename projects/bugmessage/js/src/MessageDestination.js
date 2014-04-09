//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmessage.MessageDestination')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
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
var UuidGenerator       = bugpack.require('UuidGenerator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageDestination = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(messageReceiver) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
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
        this.addressRegistered = false;

        /**
         * @private
         * @type {IMessageReceiver}
         */
        this.messageReceiver = messageReceiver;

        this.addEventPropagator(this.messageReceiver);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {IMessageReceiver}
     */
    getMessageReceiver: function() {
        return this.messageReceiver;
    },

    /**
     * @return {boolean}
     */
    isAddressRegistered: function() {
        return this.addressRegistered;
    },


    //-------------------------------------------------------------------------------
    // IMessageDestination Implementation
    //-------------------------------------------------------------------------------

    /**
     *
     */
    deregisterAddress: function() {
        if (this.addressRegistered) {
            this.addressRegistered = false;
            this.dispatchEvent(new Event(MessageDestination.EventTypes.ADDRESS_DEREGISTERED, {
                address: this.getAddress()
            }));
        }
    },

    /**
     * @return {string}
     */
    getAddress: function() {
        return this.address;
    },

    /**
     *
     */
    registerAddress: function() {
        if (!this.addressRegistered) {
            this.addressRegistered = true;
            this.dispatchEvent(new Event(MessageDestination.EventTypes.ADDRESS_REGISTERED, {
                address: this.getAddress()
            }));
        }
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
MessageDestination.EventTypes = {
    ADDRESS_REGISTERED: "MessageDestination:AddressRegistered",
    ADDRESS_DEREGISTERED: "MessageDestination:AddressDeregistered"
};



//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugmessage.MessageDestination', MessageDestination);
