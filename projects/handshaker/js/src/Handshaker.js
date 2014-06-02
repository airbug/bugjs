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

//@Export('handshaker.Handshaker')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('Collection')
//@Require('List')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('handshaker.IHand')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack Modules
    //-------------------------------------------------------------------------------

    var ArgUtil     = bugpack.require('ArgUtil');
    var Class       = bugpack.require('Class');
    var Collection  = bugpack.require('Collection');
    var List        = bugpack.require('List');
    var Obj         = bugpack.require('Obj');
    var Set         = bugpack.require('Set');
    var TypeUtil    = bugpack.require('TypeUtil');
    var BugFlow     = bugpack.require('bugflow.BugFlow');
    var ModuleTag   = bugpack.require('bugioc.ModuleTag');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');
    var IHand       = bugpack.require('handshaker.IHand');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var module      = ModuleTag.module;
    var $iterableSeries    = BugFlow.$iterableSeries;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Handshaker = Class.extend(Obj, {

        _name: "handshaker.Handshaker",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Array.<IHand>} hands
         */
        _constructor: function(hands) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Set.<IHand>}
             */
            this.hands = new Set();

            if (hands) {
                this.addHands(hands);
            }
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {IHand} hand
         */
        addHand: function(hand) {
            if (Class.doesImplement(hand, IHand)) {
                this.hands.add(hand);
            } else {
                throw new Error("parameter 'hand' must implement IHand interface");
            }
        },

        /**
         * @param {(Array.<IHand> | Collection.<IHand> | ...IHand)} hands
         */
        addHands: function(hands) {
            var _this = this;
            if (!Class.doesExtend(hands, Collection) && !TypeUtil.isArray(hands)) {
                var args = ArgUtil.toArray(arguments);
                hands = this.hands.addAll(args);
            }
            hands.forEach(function(hand) {
                _this.addHand(hand);
            });
        },

        /**
         * @returns {number}
         */
        getHandCount: function() {
            return this.hands.getCount();
        },

        /**
         * @param {IHand} hand
         * @return {boolean}
         */
        hasHand: function(hand) {
            return this.hands.contains(hand);
        },

        /**
         * @param {IHand} hand
         */
        removeHand: function(hand) {
            this.hands.remove(hand);
        },

        /**
         * @param {
         *    headers: req.headers       // <Object> the headers of the request
         *  , time: (new Date) +''       // <String> date time of the connection
         *  , address: socket.address()  // <Object> remoteAddress and remotePort object
         *  , xdomain: !!headers.origin  // <Boolean> was it a cross domain request?
         *  , secure: socket.secure      // <Boolean> https connection
         *  , issued: +date              // <Number> EPOCH of when the handshake was created
         *  , url: request.url           // <String> the entrance path of the request
         *  , query: data.query          // <Object> the result of url.parse().query or a empty object
         * } handshakeData
         * @param {function(Throwable, boolean)} callback
         */
        shake: function(handshakeData, callback) {
            var authorizations = new List();
            $iterableSeries(this.hands, function(flow, hand) {
                hand.shakeIt(handshakeData, function(throwable, authorized) {
                    if (!throwable) {
                        authorizations.add(authorized);
                    }
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
                if (!throwable) {
                    callback(undefined, !authorizations.contains(false));
                } else {
                    callback(throwable, false);
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(Handshaker).with(
        module("handshaker")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('handshaker.Handshaker', Handshaker);
});
