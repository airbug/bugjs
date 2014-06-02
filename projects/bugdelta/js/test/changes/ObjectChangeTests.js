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
//@Require('bugdelta.ObjectChange')
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
    var ObjectChange    = bugpack.require('bugdelta.ObjectChange');
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

    var objectChangeInstantiationWithoutParametersTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testObjectChange    = new ObjectChange();
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testObjectChange, ObjectChange),
                "Assert testObjectChange is an instance of ObjectChange");
            test.assertEqual(this.testObjectChange.getChangeType(), undefined,
                "Assert ObjectChange.changeType was NOT set");
            test.assertEqual(this.testObjectChange.getPath(), undefined,
                "Assert ObjectChange.path was NOT set");
            test.assertEqual(this.testObjectChange.getPropertyName(), undefined,
                "Assert ObjectChange.propertyName was NOT set");
            test.assertEqual(this.testObjectChange.getPropertyValue(), undefined,
                "Assert ObjectChange.propertyValue was Not set");
            test.assertEqual(this.testObjectChange.getPreviousValue(), undefined,
                "Assert ObjectChange.previousValue was Not set");
        }
    };

    var objectChangeInstantiationWithParametersTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testChangeType             = ObjectChange.ChangeTypes.DATA_SET;
            this.testPath                   = "some.path";
            this.testPropertyName           = "propertyName";
            this.testPropertyValue          = "propertyValue";
            this.testPreviousValue          = "previousValue";
            this.testObjectChange           = new ObjectChange(this.testChangeType, this.testPath, this.testPropertyName, this.testPropertyValue, this.testPreviousValue);
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testObjectChange.getChangeType(), this.testChangeType,
                "Assert ObjectChange.changeType was set correctly");
            test.assertEqual(this.testObjectChange.getPath(), this.testPath,
                "Assert ObjectChange.path was set correctly");
            test.assertEqual(this.testObjectChange.getPropertyName(), this.testPropertyName,
                "Assert ObjectChange.propertyName was set correctly");
            test.assertEqual(this.testObjectChange.getPropertyValue(), this.testPropertyValue,
                "Assert ObjectChange.propertyValue was set correctly");
            test.assertEqual(this.testObjectChange.getPreviousValue(), this.testPreviousValue,
                "Assert ObjectChange.previousValue was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(objectChangeInstantiationWithoutParametersTest).with(
        test().name("ObjectChange - instantiation without parameters test")
    );
    bugmeta.tag(objectChangeInstantiationWithParametersTest).with(
        test().name("ObjectChange - instantiation with parameters test")
    );
});
