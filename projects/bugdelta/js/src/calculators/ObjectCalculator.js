//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugdelta.ObjectCalculator')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaCalculator')
//@Require('bugdelta.ObjectChange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Obj                             = bugpack.require('Obj');
var TypeUtil                        = bugpack.require('TypeUtil');
var DeltaCalculator                 = bugpack.require('bugdelta.DeltaCalculator');
var ObjectChange                    = bugpack.require('bugdelta.ObjectChange');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ObjectCalculator = Class.extend(DeltaCalculator, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DeltaBuilder} deltaBuilder
     */
    _constructor: function(deltaBuilder) {

        this._super(deltaBuilder);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------
    },


    //-------------------------------------------------------------------------------
    // DeltaCalculator Implementation
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

        Obj.forIn(previousValue, function(propertyName, previousPropertyValue) {
            if (!Obj.hasProperty(currentValue, propertyName)) {
                delta.addDeltaChange(new ObjectChange(ObjectChange.ChangeTypes.PROPERTY_REMOVED, currentPath,
                    propertyName, undefined, previousPropertyValue));
            }
        });
        Obj.forIn(currentValue, function(propertyName, currentPropertyValue) {
            if (!Obj.hasProperty(previousValue, propertyName)) {
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
