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

//@Export('bugmessage.DirectResponseChannel')

//@Require('Class')
//@Require('bugmessage.AbstractResponseChannel')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var AbstractResponseChannel     = bugpack.require('bugmessage.AbstractResponseChannel');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {AbstractResponseChannel}
     */
    var DirectResponseChannel = Class.extend(AbstractResponseChannel, {

        _name: "bugmessage.DirectResponseChannel",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {IResponseReceiver}
             */
            this.responseReceiver = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {IResponseReceiver}
         */
        getResponseReceiver: function() {
            return this.responseReceiver;
        },

        /**
         * @param {IResponseReceiver} responseReceiver
         */
        setResponseReceiver: function(responseReceiver) {
            if (this.responseReceiver) {
                this.responseReceiver.removeEventPropagator(this);
            }
            this.responseReceiver = responseReceiver;
            if (this.responseReceiver) {
                this.responseReceiver.addEventPropagator(this);
            }
        },


        //-------------------------------------------------------------------------------
        // AbstractMessageChannel Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Response} response
         */
        doChannelResponse: function(response) {
            this.responseReceiver.receiveResponse(response);
        },

        /**
         *
         */
        doCloseChannel: function() {
            this.responseReceiver.closeReceiver();
            this.setResponseReceiver(null);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugmessage.DirectResponseChannel', DirectResponseChannel);
});
