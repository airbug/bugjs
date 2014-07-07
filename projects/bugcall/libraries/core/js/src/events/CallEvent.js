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

//@Export('bugcall.CallEvent')

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
    var CallEvent = Class.extend(Event, {
        _name: "bugcall.CallEvent"
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {string}
     */
    CallEvent.CLOSED                = "CallEvent:Closed";

    /**
     * @static
     * @const {string}
     */
    CallEvent.INCOMING_REQUEST      = "CallEvent:IncomingRequest";

    /**
     * @static
     * @const {string}
     */
    CallEvent.OPENED                = "CallEvent:Opened";

    /**
     * @static
     * @const {string}
     */
    CallEvent.STARTED               = "CallEvent:Started";

    /**
     * @static
     * @const {string}
     */
    CallEvent.STOPPED               = "CallEvent:Stopped";

    /**
     * @static
     * @const {string}
     */
    CallEvent.STOPPING              = "CallEvent:Stopping";

    /**
     * @static
     * @const {string}
     */
    CallEvent.REQUEST_FAILED        = "CallEvent:RequestFailed";

    /**
     * @static
     * @type {string}
     */
    CallEvent.RESPONSE_FAILED       = "CallEvent:ResponseFailed";


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallEvent', CallEvent);
});
