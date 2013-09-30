//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('DeltaBuilder')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugdelta.Delta')
//@Require('bugdelta.DeltaObject')
//@Require('bugdelta.DeltaSet')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var Set                 = bugpack.require('Set');
var TypeUtil            = bugpack.require('TypeUtil');
var Delta               = bugpack.require('bugdelta.Delta');
var DeltaObject         = bugpack.require('bugdelta.DeltaObject');
var DeltaSet            = bugpack.require('bugdelta.DeltaSet');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DeltaBuilder = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} previousValue
     * @param {*} currentValue
     * @return {Delta}
     */
    buildDelta: function(previousValue, currentValue) {
        var delta = new Delta();
        if (TypeUtil.isObject(value)) {
            if (TypeUtil.toType(value) === "Object") {
                literal = {};
                Obj.forIn(value, function(propertyName, propertyValue) {
                    literal[propertyName] = LiteralUtil.convertToLiteral(propertyValue);
                });
            } else if (Class.doesExtend(value, Set)) {

            } else {
                //TODO BRN: Support complex types
            }
        } else if (TypeUtil.isArray(value)) {
            //TODO BRN: Support arrays
        }
        return delta;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugdelta.DeltaBuilder', DeltaBuilder);
