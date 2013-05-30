//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MessageDestination')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('IMessageDestination')
//@Require('MessagePropagator')
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
var Event               = bugpack.require('Event');
var EventDispatcher     = bugpack.require('EventDispatcher');
var IMessageDestination = bugpack.require('IMessageDestination');
var UuidGenerator       = bugpack.require('UuidGenerator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageDestination = Class.extend(EventDispatcher, {

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
        this.addressRegistered = false;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

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
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MessageDestination, IMessageDestination);


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
MessageDestination.EventTypes = {
    ADDRESS_REGISTERED: "MessageRoute:AddressRegistered",
    ADDRESS_DEREGISTERED: "MessageRoute:AddressDeregistered"
};



//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('MessageDestination', MessageDestination);
