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

//@Export('bugatomic.Operation')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Set')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var EventDispatcher     = bugpack.require('EventDispatcher');
    var Set                 = bugpack.require('Set');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var Operation = Class.extend(EventDispatcher, {

        _name: "bugatomic.Operation",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} type
         * @param {Array.<string>} locks
         * @param {function(Operation)} method
         */
        _constructor: function(type, locks, method) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.type       = type;

            /**
             * @private
             * @type {Set.<string>}
             */
            this.lockSet    = new Set(locks);

            /**
             * @private
             * @type {function(function(Error))}
             */
            this.method     = method;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Set.<string>}
         */
        getLockSet: function() {
            return this.lockSet;
        },

        /**
         * @return {string}
         */
        getType: function() {
            return this.type;
        },


        //-------------------------------------------------------------------------------
        // Class Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        complete: function() {
            this.dispatchEvent(new Event(Operation.COMPLETE));
        },

        /**
         *
         */
        run: function() {
            this.method(this);
        }
    });



    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    Operation.EventTypes = {
        COMPLETE: "Operation:Complete"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugatomic.Operation', Operation);
});
