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

//@Export('bugmessage.AbstractMessageReceiver')

//@Require('Class')
//@Require('EventPropagator')
//@Require('bugmessage.IMessageReceiver')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var EventPropagator     = bugpack.require('EventPropagator');
    var IMessageReceiver    = bugpack.require('bugmessage.IMessageReceiver');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventPropagator}
     */
    var AbstractMessageReceiver = Class.extend(EventPropagator, {

        _name: "bugmessage.AbstractMessageReceiver",


        /**
         * @abstract
         * @param {Message} message
         * @param {MessageResponder} messageResponder
         */
        //doReceiveMessage: function(message, messageResponder) {},


        //-------------------------------------------------------------------------------
        // IMessageReceiver Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Message} message
         * @param {MessageResponder} messageResponder
         */
        receiveMessage: function(message, messageResponder) {
            this.doReceiveMessage(message, messageResponder);
        }
    });



    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(AbstractMessageReceiver, IMessageReceiver);


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugmessage.AbstractMessageReceiver', AbstractMessageReceiver);
});
