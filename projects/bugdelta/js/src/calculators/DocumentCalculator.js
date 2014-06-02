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

//@Export('bugdelta.DocumentCalculator')

//@Require('Class')
//@Require('IDocument')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaCalculator')
//@Require('bugdelta.DocumentChange')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var IDocument           = bugpack.require('IDocument');
    var Obj                 = bugpack.require('Obj');
    var TypeUtil            = bugpack.require('TypeUtil');
    var DeltaCalculator     = bugpack.require('bugdelta.DeltaCalculator');
    var DocumentChange      = bugpack.require('bugdelta.DocumentChange');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {DeltaCalculator}
     */
    var DocumentCalculator = Class.extend(DeltaCalculator, {

        _name: "bugdelta.DocumentCalculator",


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
            if (currentValue && Class.doesImplement(currentValue, IDocument)) {
                if (!(TypeUtil.isUndefined(previousValue) || TypeUtil.isNull(previousValue))) {
                    if (Class.doesImplement(currentValue, IDocument)) {
                        var currentData = currentValue.getData();
                        var previousData = previousValue.getData();
                        if (TypeUtil.toType(currentData) !== TypeUtil.toType(previousData)) {
                            delta.addDeltaChange(new DocumentChange(DocumentChange.ChangeTypes.DATA_SET, currentPath,
                                currentData, previousData));
                        } else if (TypeUtil.isObject(currentData) && TypeUtil.isFunction(currentData.getClass) && !Class.doesExtend(previousData, currentData.getClass().getConstructor())) {
                            delta.addDeltaChange(new DocumentChange(DocumentChange.ChangeTypes.DATA_SET, currentPath,
                                currentData, previousData));
                        } else {
                            var deltaCalculator = this.getDeltaBuilder().getCalculatorResolver().resolveCalculator(currentData);
                            if (deltaCalculator) {
                                deltaCalculator.calculateDelta(delta, currentPath, currentData, previousData);
                            } else {
                                if (TypeUtil.toType(currentData) !== "object") {
                                    if (!Obj.equals(previousData, currentData)) {
                                        delta.addDeltaChange(new DocumentChange(DocumentChange.ChangeTypes.DATA_SET, currentPath,
                                            currentData, previousData));
                                    }
                                } else {
                                    //TEST
                                    console.log("Unsupported data type found - TypeUtil.toType(currentData):", TypeUtil.toType(currentData), " TypeUtil.toType(previousData):", TypeUtil.toType(previousData));

                                    throw new Error("Unsupported data type '" + TypeUtil.toType(currentData) +
                                        "' found in Document");
                                }
                            }
                        }
                    } else {
                        throw new Error("DocumentCalculator expects previousValue to be a Document");
                    }
                } else {
                    delta.addDeltaChange(new DocumentChange(DocumentChange.ChangeTypes.DATA_SET, currentPath,
                        currentValue.getData(), previousValue));
                }
            } else {
                throw new Error("DocumentCalculator expects currentValue to be a Document");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugdelta.DocumentCalculator', DocumentCalculator);
});
