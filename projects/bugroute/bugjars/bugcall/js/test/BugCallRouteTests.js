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

//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugroute.BugCallRoute')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var BugDouble           = bugpack.require('bugdouble.BugDouble');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var BugCallRoute        = bugpack.require('bugroute.BugCallRoute');
    var TestAnnotation      = bugpack.require('bugunit.TestAnnotation');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var spyOnFunction       = BugDouble.spyOnFunction;
    var test                = TestAnnotation.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var bugCallRouteInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testRequestType    = "testRequestType";
            this.testListener       = function(callRequest, callResponder, callback) {};
            this.testBugCallRoute   = new BugCallRoute(this.testRequestType, this.testListener);
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testBugCallRoute.getRequestType(), this.testRequestType,
                "Assert #getRequestType returns the testRequestType");
            test.assertEqual(this.testBugCallRoute.getListener(), this.testListener,
                "Assert #getListener returns the testListener");

        }
    };
    bugmeta.annotate(bugCallRouteInstantiationTest).with(
        test().name("BugCallRoute - instantiation Test")
    );


    var bugCallRouteRouteTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                   = this;
            this.testCallRequest        = {};
            this.testCallResponder      = {};
            this.testCallback           = function(throwable) {};
            this.testRequestType        = "testRequestType";
            this.testListener           = function(callRequest, callResponder, callback) {
                test.assertEqual(callRequest, _this.testCallRequest,
                    "Assert callRequest received by listener is testCallRequest");
                test.assertEqual(callResponder, _this.testCallResponder,
                    "Assert callResponder received by listener is testCallResponder");
                test.assertEqual(callback, _this.testCallback,
                    "Assert callback received by listener is testCallback");
            };
            this.testListenerSpy        = spyOnFunction(this.testListener);
            this.testBugCallRoute       = new BugCallRoute(this.testRequestType, this.testListenerSpy);
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testBugCallRoute.route(this.testCallRequest, this.testCallResponder, this.testCallback);
            test.assertTrue(this.testListenerSpy.wasCalled(),
                "Assert testListener was called");
        }
    };
    bugmeta.annotate(bugCallRouteRouteTest).with(
        test().name("BugCallRoute - #route Test")
    );
});
