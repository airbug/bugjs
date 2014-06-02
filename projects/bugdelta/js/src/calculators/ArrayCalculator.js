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

//@Export('bugdelta.ArrayCalculator')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var Set         = bugpack.require('Set');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ArrayCalculator = Class.extend(Obj, {

        _name: "bugdelta.ArrayCalculator",

        //-------------------------------------------------------------------------------
        // IDeltaCalculator Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Delta} delta
         * @param {string} path
         * @param {*} currentValue
         * @param {*} previousValue
         */
        calculateDelta: function(delta, path, currentValue, previousValue) {

        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugdelta.ArrayCalculator', ArrayCalculator);
});
