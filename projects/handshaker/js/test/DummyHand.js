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

//@Export('handshaker.DummyHand')

//@Require('Class')
//@Require('Obj')
//@Require('handshaker.IHand')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack Modules
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');
    var IHand   = bugpack.require('handshaker.IHand');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implement {IHand}
     */
    var DummyHand = Class.extend(Obj, {

        _name: "handshaker.DummyHand",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {boolean} shakeResult
         * @param {Throwable} shakeThrowable
         */
        _constructor: function(shakeResult, shakeThrowable) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.shakeResult        = shakeResult;

            /**
             * @private
             * @type {Throwable}
             */
            this.shakeThrowable     = shakeThrowable;
        },


        //-------------------------------------------------------------------------------
        // IHand Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {{
         *    headers: Object,
         *    time: Date,
         *    address: Object,
         *    xdomain: boolean,
         *    secure: boolean,
         *    issued: number,
         *    url: string,
         *    query: Object
         * }} handshakeData
         * @param {function(Throwable, boolean)} callback
         */
        shakeIt: function(handshakeData, callback) {
            callback(this.shakeThrowable, this.shakeResult);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(DummyHand, IHand);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('handshaker.DummyHand', DummyHand);
});
