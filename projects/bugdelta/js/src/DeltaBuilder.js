/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugdelta.DeltaBuilder')

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
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var IDocument           = bugpack.require('IDocument');
    var Map                 = bugpack.require('Map');
    var Obj                 = bugpack.require('Obj');
    var Set                 = bugpack.require('Set');
    var TypeUtil            = bugpack.require('TypeUtil');
    var ArrayCalculator     = bugpack.require('bugdelta.ArrayCalculator');
    var CalculatorResolver  = bugpack.require('bugdelta.CalculatorResolver');
    var Delta               = bugpack.require('bugdelta.Delta');
    var DocumentCalculator  = bugpack.require('bugdelta.DocumentCalculator');
    var MapCalculator       = bugpack.require('bugdelta.MapCalculator');
    var ObjectCalculator    = bugpack.require('bugdelta.ObjectCalculator');
    var SetCalculator       = bugpack.require('bugdelta.SetCalculator');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var DeltaBuilder = Class.extend(Obj, {

        _name: "bugdelta.DeltaBuilder",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
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
        },


        //-------------------------------------------------------------------------------
        // Initializer
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        _initializer: function() {
            this._super();
            this.calculatorResolver.registerCalculatorForDataType("array", new ArrayCalculator(this));
            this.calculatorResolver.registerCalculatorForDataType("object", new ObjectCalculator(this));
            this.calculatorResolver.registerCalculatorForInterface(IDocument.getInterface(), new DocumentCalculator(this));
            this.calculatorResolver.registerCalculatorForClass(Map.getClass(), new MapCalculator(this));
            this.calculatorResolver.registerCalculatorForClass(Set.getClass(), new SetCalculator(this));
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
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugdelta.DeltaBuilder', DeltaBuilder);
});
