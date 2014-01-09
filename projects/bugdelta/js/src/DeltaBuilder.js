//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('DeltaBuilder')

//@Require('Class')
//@Require('IDocument')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugdelta.ArrayCalculator')
//@Require('bugdelta.CalculatorResolver')
//@Require('bugdelta.Delta')
//@Require('bugdelta.DocumentCalculator')
//@Require('bugdelta.MapCalculator')
//@Require('bugdelta.ObjectCalculator')
//@Require('bugdelta.SetCalculator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var IDocument                       = bugpack.require('IDocument');
var Map                             = bugpack.require('Map');
var Obj                             = bugpack.require('Obj');
var Set                             = bugpack.require('Set');
var TypeUtil                        = bugpack.require('TypeUtil');
var ArrayCalculator                 = bugpack.require('bugdelta.ArrayCalculator');
var CalculatorResolver              = bugpack.require('bugdelta.CalculatorResolver');
var Delta                           = bugpack.require('bugdelta.Delta');
var DocumentCalculator              = bugpack.require('bugdelta.DocumentCalculator');
var MapCalculator                   = bugpack.require('bugdelta.MapCalculator');
var ObjectCalculator                = bugpack.require('bugdelta.ObjectCalculator');
var SetCalculator                   = bugpack.require('bugdelta.SetCalculator');


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

        /**
         * @private
         * @type {CalculatorResolver}
         */
        this.calculatorResolver = new CalculatorResolver();

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CalculatorResolver}
     */
    getCalculatorResolver: function() {
        return this.calculatorResolver;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} current
     * @param {*} previous
     * @return {Delta}
     */
    buildDelta: function(current, previous) {
        var delta = new Delta();
        var deltaCalculator = this.calculatorResolver.resolveCalculator(current);
        deltaCalculator.calculateDelta(delta, "", current, previous);
        return delta;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initialize: function() {
        this.calculatorResolver.registerCalculatorForDataType("array", new ArrayCalculator(this));
        this.calculatorResolver.registerCalculatorForDataType("object", new ObjectCalculator(this));
        this.calculatorResolver.registerCalculatorForInterface(IDocument, new DocumentCalculator(this));
        this.calculatorResolver.registerCalculatorForClass(Map, new MapCalculator(this));
        this.calculatorResolver.registerCalculatorForClass(Set, new SetCalculator(this));
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugdelta.DeltaBuilder', DeltaBuilder);
