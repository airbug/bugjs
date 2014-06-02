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

//@Export('bugmessage.AbstractResponseReceiver')

//@Require('Class')
//@Require('EventPropagator')
//@Require('bugmessage.IResponseReceiver')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var EventPropagator     = bugpack.require('EventPropagator');
    var IResponseReceiver   = bugpack.require('bugmessage.IResponseReceiver');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventPropagator}
     */
    var AbstractResponseReceiver = Class.extend(EventPropagator, {

        _name: "bugmessage.AbstractResponseReceiver",


        /**
         * @abstract
         */
        //doCloseReceiver: function() {},

        /**
         * @abstract
         * @param {Response} response
         */
        //doReceiveResponse: function(message, messageResponder) {},


        //-------------------------------------------------------------------------------
        // IResponseReceiver Implementation
        //-------------------------------------------------------------------------------

        closeReceiver: function() {
            this.doCloseReceiver();
        },

        /**
         * @param {Response} response
         */
        receiveResponse: function(response) {
            this.doReceiveResponse(response);
        }
    });



    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(AbstractResponseReceiver, IResponseReceiver);


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugmessage.AbstractResponseReceiver', AbstractResponseReceiver);
});
