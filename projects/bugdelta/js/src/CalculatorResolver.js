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
         * @type {Map.<string, DeltaCalculator>}
         */
        this.calculatorMap  = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} dataType
     * @param {DeltaCalculator} calculator
     */
    registerCalculator: function(dataType, calculator) {
        this.calculatorMap.put(dataType, calculator);
    },

    /**
     * @param {*} data
     * @return {DeltaCalculator}
     * @throws {Error}
     */
    resolve: function(data) {
        var dataType = TypeUtil.toType(data);
        if (this.calculatorMap.contains(dataType)) {
            return this.calculatorMap.get(dataType);
        } else {
            throw new Error("No registered calculator for type '" + dataType + "'");
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugdelta.CalculatorResolver', CalculatorResolver);
