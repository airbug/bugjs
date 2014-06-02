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
//@Require('TypeUtil')
//@Require('bugcall.CallRequest')
//@Require('bugcall.CallRequestFactory')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var TypeUtil            = bugpack.require('TypeUtil');
    var CallRequest         = bugpack.require('bugcall.CallRequest');
    var CallRequestFactory  = bugpack.require('bugcall.CallRequestFactory');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');
    var BugYarn             = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var bugyarn             = BugYarn.context();
    var test                = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestCallRequestFactory", function(yarn) {
        yarn.wind({
            callRequestFactory: new CallRequestFactory()
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var callRequestFactoryInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testCallRequestFactory   = new CallRequestFactory();
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testCallRequestFactory, CallRequestFactory),
                "Assert testCallRequestFactory is an instance of CallRequestFactory");
        }
    };
    bugmeta.tag(callRequestFactoryInstantiationTest).with(
        test().name("CallRequestFactory - instantiation Test")
    );


    var callRequestFactoryFactoryCallRequestTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testCallRequestFactory   = new CallRequestFactory();
            this.testCallUuid       = "testCallUuid";
            this.testReconnect      = false;
            this.testRequestType    = "testRequestType";
            this.testRequestData    = {};
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var request = this.testCallRequestFactory.factoryCallRequest(this.testRequestType, this.testRequestData);
            test.assertTrue(Class.doesExtend(request, CallRequest),
                "Assert request returned a CallRequest");
            test.assertEqual(request.getType(), this.testRequestType,
                "Assert request type was set correctly");
            test.assertEqual(request.getData(), this.testRequestData,
                "Assert request data was set correctly");
        }
    };
    bugmeta.tag(callRequestFactoryFactoryCallRequestTest).with(
        test().name("CallRequestFactory - #factoryCallRequest Test")
    );
});
