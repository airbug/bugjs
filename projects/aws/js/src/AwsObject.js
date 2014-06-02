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

//@Export('aws.AwsObject')

//@Require('Class')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');
    var Set     = bugpack.require('Set');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var AwsObject = Class.extend(Obj, {

        _name: "aws.AwsObject",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Set.<string>}
             */
            this.changedFlags = new Set();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------


        //-------------------------------------------------------------------------------
        // Public Class Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} property
         * @return {boolean}
         */
        hasChanged: function(property) {
            if (property) {
                return this.changedFlags.contains(property);
            } else {
                return this.changedFlags.isEmpty();
            }
        },

        /**
         * @param {string} property
         */
        setChangedFlag: function(property) {
            this.changedFlags.add(property);
        },

        /**
         *
         */
        clearChangedFlags: function() {
            this.changedFlags.clear();
        },


        //-------------------------------------------------------------------------------
        // Protected Class Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @protected
         * @param {Object} jsonObject
         */
        jsonCreate: function(jsonObject) {

        },

        /**
         * @abstract
         * @protected
         * @param {Object} awsObject
         */
        syncCreate: function(awsObject) {

        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('aws.AwsObject', AwsObject);
});
