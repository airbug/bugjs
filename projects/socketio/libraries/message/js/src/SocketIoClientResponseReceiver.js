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

//@Export('socketio.SocketIoClientResponseReceiver')

//@Require('Class')
//@Require('Map')
//@Require('bugmessage.AbstractResponseReceiver')
//@Require('bugmessage.Response')
//@Require('socketio.SocketIoClient')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Map                         = bugpack.require('Map');
    var AbstractResponseReceiver    = bugpack.require('bugmessage.AbstractResponseReceiver');
    var Response                    = bugpack.require('bugmessage.Response');
    var SocketIoClient              = bugpack.require('socketio.SocketIoClient');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {AbstractResponseReceiver}
     */
    var SocketIoClientResponseReceiver = Class.extend(AbstractResponseReceiver, {

        _name: "socketio.SocketIoClientResponseReceiver",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {SocketIoClient} socketIoClient
         */
        _constructor: function(socketIoClient) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<string, IResponseChannel>}
             */
            this.responseChannelMap = new Map();

            /**
             * @private
             * @type {SocketIoClient}
             */
            this.socketIoClient = socketIoClient;
        },


        //-------------------------------------------------------------------------------
        // AbstractResponseReceiver Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Message} message
         * @param {MessageResponder} messageResponder
         */
        doReceiveResponse: function(message, messageResponder) {
            var responseChannel = messageResponder.getResponseChannel();
            this.responseChannelMap.put(responseChannel.getUuid(), responseChannel);
            this.socketIoClient.send({message: message.toObject(), responseChannel: responseChannel.toObject()});
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Error)} callback
         */
        initialize: function(callback) {
            this.socketIoClient.addEventListener(SocketIoClient.EventTypes.RESPONSE, this.hearSocketResponseEvent, this);
            callback();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Object} responseObject
         */
        processSocketResponse: function(responseObject) {
            //TODO BRN: Should use BugMarshaller here to perform the conversion
            if (responseObject) {
                var response = new Response(responseObject.type, responseObject.data);
                var headerMapObject = responseObject.headerMap;
                for (var name in headerMapObject) {
                    response.setHeader(name, headerMapObject[name]);
                }
                var responseChannelUuid = response.getHeader("responseChannelUuid");
                var responseChannel = this.responseChannelMap.get(responseChannelUuid);
                responseChannel.channelResponse(response);
            } else {
                throw new Error("SocketIoClientResponseReceiver received an incompatible response. response:" + response);
            }
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearSocketResponseEvent: function(event) {
            this.processSocketResponse(event.getData().response);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('socketio.SocketIoClientResponseReceiver', SocketIoClientResponseReceiver);
});
