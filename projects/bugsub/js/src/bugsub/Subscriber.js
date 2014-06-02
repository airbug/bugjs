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

//@Export('bugsub.Subscriber')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Subscriber = Class.extend(Obj, {

        _name: "bugsub.Subscriber",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(Message)} subscriberFunction
         * @param {Object} subscriberContext
         * @param {boolean} once
         */
        _constructor: function(subscriberFunction, subscriberContext, once) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.once                   = once;

            /**
             * @private
             * @type {Object}
             */
            this.subscriberContext      = subscriberContext;

            /**
             * @private
             * @type {function(Message)}
             */
            this.subscriberFunction     = subscriberFunction;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        getOnce: function() {
            return this.once;
        },

        /**
         * @return {Object}
         */
        getSubscriberContext: function() {
            return this.subscriberContext;
        },

        /**
         * @return {function(Message)}
         */
        getSubscriberFunction: function() {
            return this.subscriberFunction;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Message} message
         * @param {string} channel
         */
        receiveMessage: function(message, channel) {
            this.subscriberFunction.call(this.subscriberContext, message, channel);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugsub.Subscriber', Subscriber);
});
