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

//@Export('bugdelta.MapChange')

//@Require('Class')
//@Require('bugdelta.DeltaChange')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var DeltaChange     = bugpack.require('bugdelta.DeltaChange');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {DeltaChange}
     */
    var MapChange = Class.extend(DeltaChange, {

        _name: "bugdelta.MapChange",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} changeType
         * @param {string} path
         * @param {*} key
         * @param {*} value
         */
        _constructor: function(changeType, path, key, value) {

            this._super(changeType, path);


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {*}
             */
            this.key    = key;

            /**
             * @private
             * @type {*}
             */
            this.value  = value;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        getKey: function() {
            return this.key;
        },

        /**
         * @return {*}
         */
        getValue: function() {
            return this.value;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    MapChange.ChangeTypes = {
        PUT_TO_MAP: "MapChange:PutToMap",
        REMOVED_FROM_MAP: "MapChange:RemovedFromMap"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugdelta.MapChange', MapChange);
});
