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

//@Export('bugcall.CallDefines')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require("Class");
    var Obj     = bugpack.require("Obj");


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CallDefines = Class.extend(Obj, {
        _name: "bugcall.CallDefines"
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    CallDefines.MessageTypes = {
        CALL_REQUEST: "CallDefines:CallRequest",
        CALL_RESPONSE: "CallDefines:CallResponse",
        CALL_THROWABLE: "CallDefines:CallThrowable"
    };

    /**
     * @static
     * @enum {string}
     */
    CallDefines.CallState = {
        STARTED: "CallState:Started",
        STOPPED: "CallState:Stopped",
        STOPPING: "CallState:Stopping"
    };

    /**
     * @static
     * @enum {string}
     */
    CallDefines.ConnectionState = {
        CLOSED: "ConnectionState:Closed",
        CLOSING: "ConnectionState:Closing",
        OPEN: "ConnectionState:Open",
        OPENING: "ConnectionState:Opening"
    };



    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("bugcall.CallDefines", CallDefines);
});
