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

//@Export('socketio.DummySocketFactory')

//@Require('Class')
//@Require('Obj')
//@Require('socketio.DummySocketConnection')
//@Require('socketio.ISocketFactory')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Obj                     = bugpack.require('Obj');
    var DummySocketConnection   = bugpack.require('socketio.DummySocketConnection');
    var ISocketFactory          = bugpack.require('socketio.ISocketFactory');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {ISocketFactory}
     */
    var DummySocketFactory = Class.extend(Obj, {

        _name: "socketio.DummySocketFactory",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {boolean} startConnected
         */
        _constructor: function(startConnected) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {DummySocketConnection}
             */
            this.dummySocketConnection = null;

            /**
             * @private
             * @type {boolean}
             */
            this.startConnected = startConnected;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {DummySocketConnection}
         */
        getDummySocketConnection: function() {
            return this.dummySocketConnection;
        },


        //-------------------------------------------------------------------------------
        // ISocketFactory Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {string} host
         * @param {{
            *     port: number,
         *     resource: string
         * }} options
         * @return {DummySocketConnection}
         */
        createSocketConnection: function(host, options) {
            this.dummySocketConnection = new DummySocketConnection({host: host, options: options}, this.startConnected);
            return this.dummySocketConnection;
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(DummySocketFactory, ISocketFactory);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("socketio.DummySocketFactory", DummySocketFactory);
});
