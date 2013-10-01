//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('DeltaBuilder')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugdelta.ArrayCalculator')
//@Require('bugdelta.CalculatorResolver')
//@Require('bugdelta.Delta')
//@Require('bugdelta.DeltaDocumentCalculator')
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
var Obj                             = bugpack.require('Obj');
var Set                             = bugpack.require('Set');
var TypeUtil                        = bugpack.require('TypeUtil');
var ArrayCalculator                 = bugpack.require('bugdelta.ArrayCalculator');
var CalculatorResolver              = bugpack.require('bugdelta.CalculatorResolver');
var Delta                           = bugpack.require('bugdelta.Delta');
var DeltaDocumentCalculator         = bugpack.require('bugdelta.DeltaDocumentCalculator');
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
     * @param {DeltaDocument} currentDocument
     * @param {DeltaDocument} previousDocument
     * @return {Delta}
     */
    buildDelta: function(currentDocument, previousDocument) {
        var delta = new Delta();
        var deltaCalculator = this.calculatorResolver.resolve(currentDocument);
        deltaCalculator.calculateDelta(delta, "", currentDocument, previousDocument);
        return delta;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initialize: function() {
        this.calculatorResolver.registerCalculator("Array", new ArrayCalculator(this));
        this.calculatorResolver.registerCalculator("DeltaDocument", new DeltaDocumentCalculator(this));
        this.calculatorResolver.registerCalculator("Object", new ObjectCalculator(this));
        this.calculatorResolver.registerCalculator("Set", new SetCalculator(this));
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugdelta.DeltaBuilder', DeltaBuilder);
