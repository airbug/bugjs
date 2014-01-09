//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('MapCalculator')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaCalculator')
//@Require('bugdelta.MapChange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Map                             = bugpack.require('Map');
var Obj                             = bugpack.require('Obj');
var TypeUtil                        = bugpack.require('TypeUtil');
var DeltaCalculator                 = bugpack.require('bugdelta.DeltaCalculator');
var MapChange                       = bugpack.require('bugdelta.MapChange');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MapCalculator = Class.extend(DeltaCalculator, {

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
        if (!currentValue || !Class.doesExtend(currentValue, Map)) {
            throw new Error("MapCalculator expects currentValue to be an Map");
        }
        if (!previousValue || !Class.doesExtend(previousValue, Map)) {
            throw new Error("MapCalculator expects previousValue to be an Map");
        }

        previousValue.forEach(function(value, key) {
            if (!currentValue.containsKey(key)) {
                delta.addDeltaChange(new MapChange(MapChange.ChangeTypes.REMOVED_FROM_MAP, currentPath,
                    key, value));
            }
        });
        currentValue.forEach(function(currentMapValue, key) {
            if (!previousValue.containsKey(key)) {
                delta.addDeltaChange(new MapChange(MapChange.ChangeTypes.PUT_TO_MAP, currentPath,
                    key, currentMapValue));
            } else {
                var previousMapValue = previousValue.get(key);
                if (TypeUtil.toType(previousMapValue) !== TypeUtil.toType(currentMapValue)) {
                    delta.addDeltaChange(new MapChange(MapChange.ChangeTypes.PUT_TO_MAP, currentPath,
                        key, currentMapValue));
                } else if (TypeUtil.isObject(currentMapValue) && TypeUtil.isFunction(currentMapValue.getClass) && !Class.doesExtend(previousMapValue, currentMapValue.getClass())) {
                    delta.addDeltaChange(new MapChange(MapChange.ChangeTypes.PUT_TO_MAP, currentPath,
                        key, currentMapValue));
                } else {
                    var deltaCalculator = _this.getDeltaBuilder().getCalculatorResolver().resolveCalculator(currentMapValue);
                    if (deltaCalculator) {
                        var propertyPath = (currentPath ? currentPath + ".": "") + key;
                        deltaCalculator.calculateDelta(delta, propertyPath, currentMapValue, previousMapValue);
                    } else {
                        if (!Obj.equals(currentMapValue, previousMapValue)) {
                            delta.addDeltaChange(new MapChange(MapChange.ChangeTypes.PUT_TO_MAP, currentPath,
                                key, currentMapValue));
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

bugpack.export('bugdelta.MapCalculator', MapCalculator);
