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

//@Export('bugcall.CallClientEvent')

//@Require('Class')
//@Require('Event')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Event   = bugpack.require('Event');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Event}
     */
    var CallClientEvent = Class.extend(Event, {
        _name: "bugcall.CallClientEvent"
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------


    /**
     * @static
     * @const {string}
     */
    CallClientEvent.CONNECTION_CLOSED = "CallClientEvent:ConnectionClosed";

    /**
     * @static
     * @const {string}
     */
    CallClientEvent.CONNECTION_OPENED = "CallClientEvent:ConnectionOpened";

    /**
     * @static
     * @const {string}
     */
    CallClientEvent.RETRY_FAILED = "CallClientEvent:RetryFailed";


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallClientEvent', CallClientEvent);
});
