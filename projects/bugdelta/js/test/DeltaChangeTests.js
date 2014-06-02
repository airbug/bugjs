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
//@Require('bugdelta.DeltaChange')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var DeltaChange     = bugpack.require('bugdelta.DeltaChange');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var deltaChangeInstantiationWithoutParametersTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testDeltaChange            = new DeltaChange();
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testDeltaChange, DeltaChange),
                "Assert testDeltaChange is an instance of DeltaChange");
            test.assertEqual(this.testDeltaChange.getChangeType(), undefined,
                "Assert testDeltaChange.changeType was NOT set");
            test.assertEqual(this.testDeltaChange.getPath(), undefined,
                "Assert testDeltaChange.path was NOT set");
        }
    };

    var deltaChangeInstantiationWithParametersTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testChangeType             = "testChangeType";
            this.testPath                   = "some.path";
            this.testDeltaChange            = new DeltaChange(this.testChangeType, this.testPath);
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testDeltaChange.getChangeType(), this.testChangeType,
                "Assert testDeltaChange.changeType was set correctly");
            test.assertEqual(this.testDeltaChange.getPath(), this.testPath,
                "Assert testDeltaChange.path was set correctly");
        }
    };

    var deltaChangeSetPathTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testPath                   = "some.path";
            this.testDeltaChange            = new DeltaChange();
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testDeltaChange.getPath(), undefined,
                "Assert testDeltaChange.path was NOT set");
            this.testDeltaChange.setPath(this.testPath);
            test.assertEqual(this.testDeltaChange.getPath(), this.testPath,
                "Assert testDeltaChange.path was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(deltaChangeInstantiationWithoutParametersTest).with(
        test().name("DeltaChange - instantiation without parameters test")
    );
    bugmeta.tag(deltaChangeInstantiationWithParametersTest).with(
        test().name("DeltaChange - instantiation with parameters test")
    );
    bugmeta.tag(deltaChangeSetPathTest).with(
        test().name("DeltaChange - #setPath test")
    );
});
