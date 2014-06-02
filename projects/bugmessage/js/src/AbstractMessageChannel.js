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

//@Export('bugmessage.AbstractMessageChannel')

//@Require('Class')
//@Require('EventPropagator')
//@Require('bugmessage.IMessageChannel')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var EventPropagator     = bugpack.require('EventPropagator');
    var IMessageChannel     = bugpack.require('bugmessage.IMessageChannel');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventPropagator}
     */
    var AbstractMessageChannel = Class.extend(EventPropagator, {

        _name: "bugmessage.AbstractMessageChannel",


        /**
         * @abstract
         * @param message
         * @param messageResponder
         */
        //doChannelMessage: function(message, messageResponder) {},


        //-------------------------------------------------------------------------------
        // IMessageChannel Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Message} message
         * @param {MessageResponder} messageResponder
         */
        channelMessage: function(message, messageResponder) {
            this.doChannelMessage(message, messageResponder);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(AbstractMessageChannel, IMessageChannel);


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugmessage.AbstractMessageChannel', AbstractMessageChannel);
});
