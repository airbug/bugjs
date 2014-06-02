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

//@Export('DestinationMessageRouter')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugmessage.AbstractMessageRouter')
//@Require('bugmessage.DestinationRoute')
//@Require('bugmessage.MessageDestination')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Map                     = bugpack.require('Map');
    var Obj                     = bugpack.require('Obj');
    var AbstractMessageRouter   = bugpack.require('bugmessage.AbstractMessageRouter');
    var DestinationRoute        = bugpack.require('bugmessage.DestinationRoute');
    var MessageDestination      = bugpack.require('bugmessage.MessageDestination');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {AbstractMessageRouter}
     */
    var DestinationMessageRouter = Class.extend(AbstractMessageRouter, {

        _name: "DestinationMessageRouter",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<string, DestinationRoute>}
             */
            this.messageAddressToDestinationRouteMap = new Map();

            /**
             * @private
             * @type {Map.<MessageChannel, DestinationRoute>}
             */
            this.messageChannelToDestinationRouteMap = new Map();
        },


        //-------------------------------------------------------------------------------
        // AbstractDestinationRouter Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Message} message
         * @param {MessageResponder} messageResponder
         */
        routeMessage: function(message, messageResponder) {
            var destinationAddressHeader = message.getHeader("destinationAddress");
            if (destinationAddressHeader) {
                var destinationRoute = this.messageAddressToDestinationRouteMap.get(destinationAddressHeader);
                if (destinationRoute) {
                    var messageChannel = destinationRoute.getMessageChannel();
                    messageChannel.channelMessage(message, messageResponder);
                }
            } else {
                //TODO BRN: Should we route to some sort of default channel?
            }
        },


        //-------------------------------------------------------------------------------
        // AbstractDestinationRouter Extensions/Overrides
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @param {MessageChannel} messageChannel
         * @return {boolean}
         */
        addMessageChannel: function(messageChannel) {
            if (!this.messageChannelList.contains(messageChannel)) {
                this.messageChannelList.add(messageChannel);
                this.addDestinationRouteForMessageChannel(messageChannel);
                return true;
            }
            return false;
        },

        /**
         * @override
         * @param {MessageChannel} messageChannel
         * @return {boolean}
         */
        removeMessageChannel: function(messageChannel) {
            var result = this.messageChannelList.remove(messageChannel);
            if (result) {
                this.removeDestinationRouteForMessageChannel(messageChannel);
            }
            return result;
        },


        //-------------------------------------------------------------------------------
        // Private Class Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {MessageChannel} messageChannel
         */
        addDestinationRouteForMessageChannel: function(messageChannel) {
            var destinationRoute = new DestinationRoute(messageChannel);
            destinationRoute.addEventListener(MessageDestination.EventTypes.ADDRESS_DEREGISTERED, this.hearAddressDeregisteredEvent, this);
            destinationRoute.addEventListener(MessageDestination.EventTypes.ADDRESS_REGISTERED, this.hearAddressRegisteredEvent, this);
            destinationRoute.initialize();
            destinationRoute.addEventPropagator(this);
            this.messageChannelToDestinationRouteMap.put(messageChannel, destinationRoute);
        },

        /**
         * @private
         * @param {MessageChannel} messageChannel
         */
        removeDestinationRouteForMessageChannel: function(messageChannel) {
            var _this = this;
            var destinationRoute = this.messageChannelToDestinationRouteMap.get(messageChannel);
            destinationRoute.deinitialize();
            destinationRoute.removeEventListener(MessageDestination.EventTypes.ADDRESS_DEREGISTERED, this.hearAddressDeregisteredEvent, this);
            destinationRoute.removeEventListener(MessageDestination.EventTypes.ADDRESS_REGISTERED, this.hearAddressRegisteredEvent, this);
            var addressSet = destinationRoute.getAddressSet();
            addressSet.forEach(function(address) {
                _this.deregisterAddressWithDestinationRoute(address, destinationRoute);
            });
            destinationRoute.removeEventPropagator(this);
            this.messageChannelToDestinationRouteMap.remove(messageChannel);
        },

        /**
         * @private
         * @param {string} address
         * @param {DestinationRoute} destinationRoute
         */
        registerAddressWithDestinationRoute: function(address, destinationRoute) {
            var currentDestinationRoute = this.me.get(address);
            if (!currentDestinationRoute) {
                this.messageAddressToDestinationRouteMap.put(address, destinationRoute);
            } else {
                throw new Error("DestinationRoute already exists for address '" + address + "'");
            }
        },

        /**
         * @private
         * @param {string} address
         * @param {DestinationRoute} destinationRoute
         */
        deregisterAddressWithDestinationRoute: function(address, destinationRoute) {
            var currentDestinationRoute = this.messageAddressToDestinationRouteMap.get(address);
            if (Obj.equals(currentDestinationRoute, destinationRoute)) {
                this.messageAddressToDestinationRouteMap.remove(address);
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
            var destinationRoute = event.getCurrentTarget();
            var address = event.getData().address;
            this.deregisterAddressWithDestinationRoute(address, destinationRoute);
            event.stopPropagation();
        },

        /**
         * @private
         * @param {Event} event
         */
        hearAddressRegisteredEvent: function(event) {
            var destinationRoute = event.getCurrentTarget();
            var address = event.getData().address;
            this.registerAddressWithDestinationRoute(address, destinationRoute);
            event.stopPropagation();
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugmessage.DestinationMessageRouter', DestinationMessageRouter);
});
