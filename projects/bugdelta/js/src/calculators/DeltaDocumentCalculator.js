//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('DeltaDocumentCalculator')

//@Require('Class')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaCalculator')
//@Require('bugdelta.DeltaDocument')
//@Require('bugdelta.DeltaDocumentChange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var TypeUtil                        = bugpack.require('TypeUtil');
var DeltaCalculator                 = bugpack.require('bugdelta.DeltaCalculator');
var DeltaDocument                   = bugpack.require('bugdelta.DeltaDocument');
var DeltaDocumentChange             = bugpack.require('bugdelta.DeltaDocumentChange');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DeltaDocumentCalculator = Class.extend(DeltaCalculator, {

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
        if (currentValue && Class.doesExtend(currentValue, DeltaDocument)) {
            if (!(TypeUtil.isUndefined(previousValue) || TypeUtil.isNull(previousValue))) {
                if (Class.doesExtend(currentValue, DeltaDocument)) {
                    var currentData = currentValue.getData();
                    var previousData = previousValue.getData();
                    if (TypeUtil.toType(currentData) !== TypeUtil.toType(previousData)) {
                        delta.addDeltaChange(new DeltaDocumentChange(DeltaDocumentChange.ChangeTypes.DATA_SET, currentPath,
                            currentValue.getData(), previousValue.getData()));
                    } else if (TypeUtil.isObject(currentData) && TypeUtil.isFunction(currentData.getClass) && !Class.doesExtend(previousData, currentData.getClass())) {
                        delta.addDeltaChange(new DeltaDocumentChange(DeltaDocumentChange.ChangeTypes.DATA_SET, currentPath,
                            currentValue.getData(), previousValue.getData()));
                    } else {
                        var deltaCalculator = this.getDeltaBuilder().getCalculatorResolver().resolveCalculator(currentData);
                        if (deltaCalculator) {
                            deltaCalculator.calculateDelta(delta, currentPath, currentData, previousData);
                        } else {
                            throw new Error("Unsupported data type '" + TypeUtil.toType(currentData) +
                                "' found in DeltaDocument");
                        }
                    }
                } else {
                    throw new Error("DeltaDocumentCalculator expects previousValue to be a DeltaDocument");
                }
            } else {
                delta.addDeltaChange(new DeltaDocumentChange(DeltaDocumentChange.ChangeTypes.DATA_SET, currentPath,
                    currentValue.getData(), previousValue));
            }
        } else {
            throw new Error("DeltaDocumentCalculator expects currentValue to be a DeltaDocument");
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugdelta.DeltaDocumentCalculator', DeltaDocumentCalculator);
