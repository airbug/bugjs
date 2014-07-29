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

//@Export('bugdelta.ObjectCalculator')

//@Require('Class')
//@Require('Obj')
//@Require('ObjectUtil')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaCalculator')
//@Require('bugdelta.ObjectChange')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var ObjectUtil          = bugpack.require('ObjectUtil');
    var TypeUtil            = bugpack.require('TypeUtil');
    var DeltaCalculator     = bugpack.require('bugdelta.DeltaCalculator');
    var ObjectChange        = bugpack.require('bugdelta.ObjectChange');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {DeltaCalculator}
     */
    var ObjectCalculator = Class.extend(DeltaCalculator, {

        _name: "bugdelta.ObjectCalculator",


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
            var _this = this;
            if (!currentValue || !TypeUtil.isObject(currentValue)) {
                throw new Error("ObjectCalculator expects currentValue to be an Object");
            }
            if (!previousValue || !TypeUtil.isObject(previousValue)) {
                throw new Error("ObjectCalculator expects previousValue to be an Object");
            }

            ObjectUtil.forIn(previousValue, function(propertyName, previousPropertyValue) {
                if (!ObjectUtil.hasProperty(currentValue, propertyName)) {
                    delta.addDeltaChange(new ObjectChange(ObjectChange.ChangeTypes.PROPERTY_REMOVED, currentPath,
                        propertyName, undefined, previousPropertyValue));
                }
            });
            ObjectUtil.forIn(currentValue, function(propertyName, currentPropertyValue) {
                if (!ObjectUtil.hasProperty(previousValue, propertyName)) {
                    delta.addDeltaChange(new ObjectChange(ObjectChange.ChangeTypes.PROPERTY_SET, currentPath,
                        propertyName, currentPropertyValue, undefined));
                } else {
                    var previousPropertyValue = previousValue[propertyName];
                    if (TypeUtil.toType(previousPropertyValue) !== TypeUtil.toType(currentPropertyValue)) {
                        delta.addDeltaChange(new ObjectChange(ObjectChange.ChangeTypes.PROPERTY_SET, currentPath,
                            propertyName, currentPropertyValue, previousPropertyValue));
                    } else if (TypeUtil.isObject(currentPropertyValue) && TypeUtil.isFunction(currentPropertyValue.getClass) && !Class.doesExtend(previousPropertyValue, currentPropertyValue.getClass().getConstructor())) {
                        delta.addDeltaChange(new ObjectChange(ObjectChange.ChangeTypes.PROPERTY_SET, currentPath,
                            propertyName, currentPropertyValue, previousPropertyValue));
                    } else {
                        var deltaCalculator = _this.getDeltaBuilder().getCalculatorResolver().resolveCalculator(currentPropertyValue);
                        if (deltaCalculator) {
                            var propertyPath = (currentPath ? currentPath + ".": "") + propertyName;
                            deltaCalculator.calculateDelta(delta, propertyPath, currentPropertyValue, previousPropertyValue);
                        } else {
                            if (!Obj.equals(currentPropertyValue, previousPropertyValue)) {
                                delta.addDeltaChange(new ObjectChange(ObjectChange.ChangeTypes.PROPERTY_SET, currentPath,
                                    propertyName, currentPropertyValue, previousPropertyValue));
                            }
                        }
                    }
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugdelta.ObjectCalculator', ObjectCalculator);
});
