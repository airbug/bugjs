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

//@Export('bugyarn.Weaver')

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
    var Weaver = Class.extend(Obj, {

        _name: "bugyarn.Weaver",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} weaverName
         * @param {function(Yarn, Array.<*>):*} weaverFunction
         */
        _constructor: function(weaverName, weaverFunction) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(Yarn, Array.<*>):*}
             */
            this.weaverFunction     = weaverFunction;

            /**
             * @private
             * @type {string}
             */
            this.weaverName         = weaverName;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {function(Yarn, Array.<*>):*}
         */
        getWeaverFunction: function() {
            return this.weaverFunction;
        },

        /**
         * @return {string}
         */
        getWeaverName: function() {
            return this.weaverName;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Yarn} yarn
         * @param {Array.<*>} args
         * @return {*}
         */
        runWeaver: function(yarn, args) {
            args = args || [];
            return this.weaverFunction.call(yarn.getYarnContext(), yarn, args);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugyarn.Weaver', Weaver);
});
