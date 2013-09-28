//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('DeltaBuilder')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
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
     * @param {*} value
     * @return {IDelta}
     */
    buildDelta: function(value) {
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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugdelta.DeltaBuilder', DeltaBuilder);
