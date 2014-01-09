//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('DocumentCalculator')

//@Require('Class')
//@Require('IDocument')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaCalculator')
//@Require('bugdelta.DocumentChange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var IDocument                        = bugpack.require('IDocument');
var TypeUtil                        = bugpack.require('TypeUtil');
var DeltaCalculator                 = bugpack.require('bugdelta.DeltaCalculator');
var DocumentChange                  = bugpack.require('bugdelta.DocumentChange');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DocumentCalculator = Class.extend(DeltaCalculator, {

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
        if (currentValue && Class.doesImplement(currentValue, IDocument)) {
            if (!(TypeUtil.isUndefined(previousValue) || TypeUtil.isNull(previousValue))) {
                if (Class.doesImplement(currentValue, IDocument)) {
                    var currentData = currentValue.getData();
                    var previousData = previousValue.getData();
                    if (TypeUtil.toType(currentData) !== TypeUtil.toType(previousData)) {
                        delta.addDeltaChange(new DocumentChange(DocumentChange.ChangeTypes.DATA_SET, currentPath,
                            currentValue.getData(), previousValue.getData()));
                    } else if (TypeUtil.isObject(currentData) && TypeUtil.isFunction(currentData.getClass) && !Class.doesExtend(previousData, currentData.getClass())) {
                        delta.addDeltaChange(new DocumentChange(DocumentChange.ChangeTypes.DATA_SET, currentPath,
                            currentValue.getData(), previousValue.getData()));
                    } else {
                        var deltaCalculator = this.getDeltaBuilder().getCalculatorResolver().resolveCalculator(currentData);
                        if (deltaCalculator) {
                            deltaCalculator.calculateDelta(delta, currentPath, currentData, previousData);
                        } else {
                            throw new Error("Unsupported data type '" + TypeUtil.toType(currentData) +
                                "' found in Document");
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
