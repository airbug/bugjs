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

//@Export('bugcall.DummyBugCallServer')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('bugcall.CallEvent')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack Modules
    //-------------------------------------------------------------------------------


    var Class               = bugpack.require('Class');
    var EventDispatcher     = bugpack.require('EventDispatcher');
    var CallEvent           = bugpack.require('bugcall.CallEvent');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var DummyBugCallServer = Class.extend(EventDispatcher, {

        _name: "bugcall.DummyBugCallServer",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} call
         */
        connect: function(call) {
            this.dispatchEvent(new CallEvent(CallEvent.OPENED, {
                call: call
            }));
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.DummyBugCallServer', DummyBugCallServer);
});
