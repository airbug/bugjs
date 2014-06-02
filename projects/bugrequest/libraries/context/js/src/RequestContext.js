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

//@Export('bugrequest.RequestContext')

//@Require('Class')
//@Require('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Map     = bugpack.require('Map');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var RequestContext = Class.extend(Obj, {

        _name: "bugrequest.RequestContext",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {*} request
         */
        _constructor: function(request) {

            this._super();


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<string, *>}
             */
            this.contextMap     = new Map();

            /**
             * @private
             * @type {*} request
             */
            this.request        = request;
        },


        //-------------------------------------------------------------------------------
        //  Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        getRequest: function() {
            return this.request;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} key
         */
        get: function(key) {
            return this.contextMap.get(key);
        },

        /**
         *
         */
        set: function(key, value) {
            this.contextMap.put(key, value);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugrequest.RequestContext', RequestContext);
});
