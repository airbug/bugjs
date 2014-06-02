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

//@TestFile

//@Require('Class')
//@Require('bugdelta.DeltaCalculator')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var DeltaCalculator     = bugpack.require('bugdelta.DeltaCalculator');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var test                = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var deltaCalculatorInstantiationWithoutParametersTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testDeltaCalculator            = new DeltaCalculator();
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testDeltaCalculator, DeltaCalculator),
                "Assert testDeltaCalculator is an instance of DeltaCalculator");
            test.assertEqual(this.testDeltaCalculator.getDeltaBuilder(), undefined,
                "Assert testDeltaCalculator.deltaBuilder was NOT set");
        }
    };

    var deltaCalculatorInstantiationWithParametersTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testDeltaBuilder               = {};
            this.testDeltaCalculator            = new DeltaCalculator(this.testDeltaBuilder);
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testDeltaCalculator.getDeltaBuilder(), this.testDeltaBuilder,
                "Assert testDeltaCalculator.deltaBuilder was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(deltaCalculatorInstantiationWithoutParametersTest).with(
        test().name("DeltaCalculator - instantiation without parameters test")
    );
    bugmeta.tag(deltaCalculatorInstantiationWithParametersTest).with(
        test().name("DeltaCalculator - instantiation with parameters test")
    );
});
