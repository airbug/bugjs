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

//@Export('bugmessage.MessageResponder')

//@Require('Class')
//@Require('bugmessage.AbstractResponder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var AbstractResponder   = bugpack.require('bugmessage.AbstractResponder');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {AbstractResponder}
     */
    var MessageResponder = Class.extend(AbstractResponder, {

        _name: "bugmessage.MessageResponder",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @param {Response} response
         * @param {function(Error)} callback
         */
        doSendResponse: function(response, callback) {
            response.setHeader("responseChannelUuid", this.getResponseChannel().getUuid());
            this.getResponseChannel().channelResponse(response);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugmessage.MessageResponder', MessageResponder);
});
