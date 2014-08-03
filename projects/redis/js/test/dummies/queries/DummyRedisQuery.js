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

//@Export('redis.DummyRedisQuery')

//@Require('Class')
//@Require('Obj')
//@Require('Tracer')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');
    var Tracer  = bugpack.require('Tracer');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $trace  = Tracer.$trace;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var DummyRedisQuery = Class.extend(Obj, {

        _name: "redis.DummyRedisQuery",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {DummyRedis} dummyRedisClient
         */
        _constructor: function(dummyRedisClient) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {DummyRedisClient}
             */
            this.dummyRedisClient = dummyRedisClient;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {DummyRedisClient}
         */
        getDummyRedisClient: function() {
            return this.dummyRedisClient;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Error, *=)} callback
         */
        exec: function(callback) {
            var _this   = this;
            var result  = null;
            var error   = null;
            if (!callback) {
                throw new Error("callback is undefined");
            }
            setTimeout($trace(function() {
                try {
                    result = _this.query();
                } catch(e) {
                    error = e;
                }
                if (!error) {
                    callback(null, result);
                } else {
                    callback(error);
                }
            }), 0);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('redis.DummyRedisQuery', DummyRedisQuery);
});
