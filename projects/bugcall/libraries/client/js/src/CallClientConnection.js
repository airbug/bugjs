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

//@Export('bugcall.CallClientConnection')

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
    var CallClientConnection = Class.extend(CallConnection, {

        _name: "bugcall.CallClientConnection",


        //-------------------------------------------------------------------------------
        // CallConnection Implementation
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        doClose: function() {
            this.getSocketConnection().emit("callTerminate");
        },

        /**
         * @protected
         */
        doDeinitialize: function() {
            this._super();
            this.getSocketConnection().removeEventListener("callClosing", this.hearCallClosing, this);
        },

        /**
         * @protected
         */
        doInitialize: function() {
            this._super();
            this.getSocketConnection().addEventListener("callClosing", this.hearCallClosing, this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {NodeJsEvent} event
         */
        hearCallClosing: function(event) {
            this.changeStateClosing();
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallClientConnection', CallClientConnection);
});
