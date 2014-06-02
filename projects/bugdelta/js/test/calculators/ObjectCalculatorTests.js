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
//@Require('bugdelta.Delta')
//@Require('bugdelta.DeltaBuilder')
//@Require('bugdelta.ObjectCalculator')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Delta                       = bugpack.require('bugdelta.Delta');
    var DeltaBuilder                = bugpack.require('bugdelta.DeltaBuilder');
    var ObjectCalculator            = bugpack.require('bugdelta.ObjectCalculator');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var TestTag                     = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                     = BugMeta.context();
    var test                        = TestTag.test;


    //-------------------------------------------------------------------------------
    // Setup Methods
    //-------------------------------------------------------------------------------

    var setupObjectCalculatorTest   = function(setupObject) {
        setupObject.testDelta                   = new Delta();
        setupObject.testDeltaBuilder            = new DeltaBuilder();
        setupObject.testObjectCalculator        = new ObjectCalculator(setupObject.testDeltaBuilder);
    };


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var objectCalculatorInstantiationWithoutParametersTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testObjectCalculator    = new ObjectCalculator();
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testObjectCalculator, ObjectCalculator),
                "Assert testObjectCalculator is an instance of ObjectCalculator");
            test.assertEqual(this.testObjectCalculator.getDeltaBuilder(), undefined,
                "Assert testObjectCalculator.deltaBuilder was NOT set");
        }
    };

    var objectCalculatorInstantiationWithParametersTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testDeltaBuilder           = new DeltaBuilder();
            this.testObjectCalculator       = new ObjectCalculator(this.testDeltaBuilder);
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testObjectCalculator.getDeltaBuilder(), this.testDeltaBuilder,
                "Assert testObjectCalculator.deltaBuilder was set correctly");
        }
    };

    var objectCalculatorCalculateDeltaNoChangeEmptyObjectTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            setupObjectCalculatorTest(this);
            this.testObject1 = {};
            this.testObject2 = {};
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testObjectCalculator.calculateDelta(this.testDelta, "", this.testObject1, this.testObject2);
            test.assertTrue(this.testDelta.isEmpty(),
                "Assert that no changes were found");
        }
    };

    var objectCalculatorCalculateDeltaNoChangeTypesTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            setupObjectCalculatorTest(this);
            var time    = new Date().getTime();
            this.noChangeValues = [
                new String("string"),
                new Number(1),
                "string",
                0,
                100,
                true,
                false,
                undefined,
                null,
                new Date(time)
            ];
            this.noChangeComparison = [
                new String("string"),
                new Number(1),
                "string",
                0,
                100,
                true,
                false,
                undefined,
                null,
                new Date(time)
            ];
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            for (var i = 0, size = this.noChangeValues.length; i < size; i++) {
                var delta       = new Delta();
                var value       = this.noChangeValues[i];
                var comparison  = this.noChangeComparison[i];
                var testObject1 = {
                    testProperty: value
                };
                var testObject2 = {
                    testProperty: comparison
                }
                this.testObjectCalculator.calculateDelta(delta, "", testObject1, testObject2);
                test.assertTrue(delta.isEmpty(),
                    "Assert that no changes were found when comparing a property value of - value:" + value + " comparison:" + comparison);
            }

        }
    };

    var objectCalculatorCalculateDeltaPropertySetChangeTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testPropertyValue = "testPropertyValue";
            setupObjectCalculatorTest(this)
            this.testObject1 = {};
            this.testObject2 = {
                newProperty: this.testPropertyValue
            };
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testObjectCalculator.calculateDelta(this.testDelta, "", this.testObject1, this.testObject2);
            test.assertEqual(this.testDelta.getChangeCount(), 1,
                "Assert there is one change");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(objectCalculatorInstantiationWithoutParametersTest).with(
        test().name("ObjectCalculator - instantiation without parameters test")
    );
    bugmeta.tag(objectCalculatorInstantiationWithParametersTest).with(
        test().name("ObjectCalculator - instantiation with parameters test")
    );
    bugmeta.tag(objectCalculatorCalculateDeltaNoChangeEmptyObjectTest).with(
        test().name("ObjectCalculator - calculate delta no change empty object test")
    );
    bugmeta.tag(objectCalculatorCalculateDeltaNoChangeTypesTest).with(
        test().name("ObjectCalculator - calculate delta no change types test")
    );
    bugmeta.tag(objectCalculatorCalculateDeltaPropertySetChangeTest).with(
        test().name("ObjectCalculator - calculate delta property set change test")
    );
});
