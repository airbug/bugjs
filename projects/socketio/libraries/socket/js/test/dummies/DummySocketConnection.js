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

//@Export('socketio.DummySocketConnection')

//@Require('ArgUtil')
//@Require('Class')
//@Require('EventReceiver')
//@Require('Map')
//@Require('NodeJsEvent')
//@Require('TypeUtil')
//@Require('socketio.SocketIoConnection')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil             = bugpack.require('ArgUtil');
    var Class               = bugpack.require('Class');
    var EventReceiver       = bugpack.require('EventReceiver');
    var Map                 = bugpack.require('Map');
    var NodeJsEvent         = bugpack.require('NodeJsEvent');
    var TypeUtil            = bugpack.require('TypeUtil');
    var SocketIoConnection  = bugpack.require('socketio.SocketIoConnection');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {SocketIoConnection}
     */
    var DummySocketConnection = Class.extend(SocketIoConnection, {

        _name: "socketio.DummySocketConnection",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {boolean} connected
         */
        _constructor: function(connected) {
            var dummySocket = {
                addListener: function() {},
                emit: function() {},
                removeListener: function() {}
            };
            this._super(dummySocket, connected);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('socketio.DummySocketConnection', DummySocketConnection);
});
