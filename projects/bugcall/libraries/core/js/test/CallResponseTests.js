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

//@Require('TypeUtil')
//@Require('bugcall.CallResponse')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var TypeUtil        = bugpack.require('TypeUtil');
    var CallResponse    = bugpack.require('bugcall.CallResponse');
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

    var callResponseInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testData           = {};
            this.testRequestUuid    = "testRequestUuid";
            this.testType           = "testType";
            this.testCallResponse   = new CallResponse(this.testType, this.testData, this.testRequestUuid);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testCallResponse.getType(), this.testType,
                "Assert #getType returns 'testType'");
            test.assertEqual(this.testCallResponse.getData(), this.testData,
                "Assert #getData returns 'testData'");
            test.assertEqual(this.testCallResponse.getRequestUuid(), this.testRequestUuid,
                "Assert #getRequestUuid returns 'testRequestUuid'");
            test.assertTrue(TypeUtil.isString(this.testCallResponse.getUuid()),
                "Assert #getUuid returns a string");
        }
    };

    var callResponseToObjectTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testData           = {};
            this.testRequestUuid    = "testRequestUuid";
            this.testType           = "testType";
            this.testCallResponse   = new CallResponse(this.testType, this.testData, this.testRequestUuid);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var responseObject = this.testCallResponse.toObject();
            test.assertTrue(TypeUtil.isObject(responseObject),
                "Assert responseObject is an Object");
            test.assertEqual(responseObject.type, this.testType,
                "Assert responseObject.type is 'testType'");
            test.assertEqual(responseObject.data, this.testData,
                "Assert responseObject.data is 'testData'");
            test.assertEqual(responseObject.requestUuid, this.testRequestUuid,
                "Assert responseObject.requestUuid is 'testRequestUuid'");
            test.assertEqual(responseObject.uuid, this.testCallResponse.getUuid(),
                "Assert responseObject.uiud is 'this.testCallResponse.getUuid()'");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(callResponseInstantiationTest).with(
        test().name("CallResponse - instantiation Test")
    );
    bugmeta.tag(callResponseToObjectTest).with(
        test().name("CallResponse - #toObject Test")
    );
});
