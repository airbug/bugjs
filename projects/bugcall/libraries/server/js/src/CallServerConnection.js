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

//@Export('bugcall.CallServerConnection')

//@Require('Class')
//@Require('bugcall.CallConnection')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var CallConnection  = bugpack.require('bugcall.CallConnection');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CallConnection}
     */
    var CallServerConnection = Class.extend(CallConnection, {

        _name: "bugcall.CallServerConnection",


        //-------------------------------------------------------------------------------
        // CallConnection Implementation
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        doClose: function() {
            this.socketConnection.emit("callClosing");
            this.socketConnection.disconnect();
        },

        /**
         * @protected
         */
        doDeinitialize: function() {
            this._super();
            this.socketConnection.removeEventListener("callTerminate", this.hearCallTerminate, this);
        },

        /**
         * @protected
         */
        doInitialize: function() {
            this._super();
            this.socketConnection.addEventListener("callTerminate", this.hearCallTerminate, this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {NodeJsEvent} event
         */
        hearCallTerminate: function(event) {
            this.changeStateClosing();
            this.doClose();
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallServerConnection', CallServerConnection);
});
