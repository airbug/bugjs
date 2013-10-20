//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('CalculatorResolver')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var TypeUtil            = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CalculatorResolver = Class.extend(Obj, {

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

        /**
         * @private
         * @type {Map.<Class, DeltaCalculator>}
         */
        this.classCalculatorMap     = new Map();

        /**
         * @private
         * @type {Map.<string, DeltaCalculator>}
         */
        this.dataTypeCalculatorMap  = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Class} _class
     * @param {DeltaCalculator} calculator
     */
    registerCalculatorForClass: function(_class, calculator) {
        this.classCalculatorMap.put(_class, calculator);
    },

    /**
     * @param {string} dataType
     * @param {DeltaCalculator} calculator
     */
    registerCalculatorForDataType: function(dataType, calculator) {
        this.dataTypeCalculatorMap.put(dataType, calculator);
    },

    /**
     * @param {*} value
     * @return {DeltaCalculator}
     */
    resolveCalculator: function(value) {
        if (TypeUtil.isObject(value) && TypeUtil.isFunction(value.getClass)) {
            var _class = value.getClass();
            if (this.classCalculatorMap.containsKey(_class)) {
                return this.classCalculatorMap.get(_class);
            }
        } else {
            var dataType = TypeUtil.toType(value);
            if (this.dataTypeCalculatorMap.containsKey(dataType)) {
                return this.dataTypeCalculatorMap.get(dataType);
            }
        }
        return undefined;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugdelta.CalculatorResolver', CalculatorResolver);
