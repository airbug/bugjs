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

//@Export('bugdelta.SetCalculator')

//@Require('Class')
//@Require('Set')
//@Require('bugdelta.DeltaCalculator')
//@Require('bugdelta.SetChange')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Set                 = bugpack.require('Set');
    var DeltaCalculator     = bugpack.require('bugdelta.DeltaCalculator');
    var SetChange           = bugpack.require('bugdelta.SetChange');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {DeltaCalculator}
     */
    var SetCalculator = Class.extend(DeltaCalculator, {

        _name: "bugdelta.SetCalculator",


        //-------------------------------------------------------------------------------
        // DeltaCalculator Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Delta} delta
         * @param {string} currentPath
         * @param {*} currentValue
         * @param {*} previousValue
         */
        calculateDelta: function(delta, currentPath, currentValue, previousValue) {
            if (!currentValue || !Class.doesExtend(currentValue, Set)) {
                throw new Error("SetCalculator expects currentValue to be a Set");
            }
            if (!previousValue || !Class.doesExtend(currentValue, Set)) {
                throw new Error("SetCalculator expects previousValue to be a Set");
            }

            previousValue.forEach(function(previousItem) {
                if (!currentValue.contains(previousItem)) {
                    delta.addDeltaChange(new SetChange(SetChange.ChangeTypes.REMOVED_FROM_SET, currentPath,
                        previousItem));
                }
            });
            currentValue.forEach(function(currentItem) {
                if (!previousValue.contains(currentItem)) {
                    delta.addDeltaChange(new SetChange(SetChange.ChangeTypes.ADDED_TO_SET, currentPath,
                        currentItem));
                } else {
                    // TODO BRN: We'll need some way of looking up objects in order to generate deltas for items in a Set
                    // that have changed.
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugdelta.SetCalculator', SetCalculator);
});
