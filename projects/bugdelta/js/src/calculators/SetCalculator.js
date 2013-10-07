//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('SetCalculator')

//@Require('Class')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaCalculator')
//@Require('bugdelta.SetChange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Set                             = bugpack.require('Set');
var TypeUtil                        = bugpack.require('TypeUtil');
var DeltaCalculator                 = bugpack.require('bugdelta.DeltaCalculator');
var SetChange                       = bugpack.require('bugdelta.SetChange');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SetCalculator = Class.extend(DeltaCalculator, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
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
