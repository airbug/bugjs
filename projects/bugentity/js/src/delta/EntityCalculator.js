//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugentity.EntityCalculator')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaCalculator')
//@Require('bugdelta.ObjectChange')
//@Require('bugentity.Entity')


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
var Entity                          = bugpack.require('bugentity.Entity');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityCalculator = Class.extend(DeltaCalculator, {

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
        if (!currentValue || !Class.doesExtend(currentValue, Entity)) {
            throw new Error("EntityCalculator expects currentValue to be an Entity");
        }
        if (!previousValue || !Class.doesExtend(currentValue, Entity)) {
            throw new Error("EntityCalculator expects previousValue to be an Entity");
        }

        var currentDocument     = currentValue.getDeltaDocument();
        var previousDocument    = previousValue.getDeltaDocument();
        var deltaCalculator = this.getDeltaBuilder().getCalculatorResolver().resolveCalculator(currentDocument);
        deltaCalculator.calculateDelta(delta, currentPath, currentDocument, previousDocument);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityCalculator', EntityCalculator);
