/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmessage.MessageDestination')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('UuidGenerator')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

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

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var MessageDestination = Class.extend(EventDispatcher, {

        _name: "bugmessage.MessageDestination",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IMessageReceiver} messageReceiver
         */
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
     * @static
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
});
