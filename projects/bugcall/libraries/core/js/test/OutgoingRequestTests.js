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
//@Require('bugcall.OutgoingRequest')
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
    var TypeUtil            = bugpack.require('TypeUtil');
    var OutgoingRequest     = bugpack.require('bugcall.OutgoingRequest');
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

    var outgoingRequestInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testCallRequest        = {};
            this.testOutgoingRequest    = new OutgoingRequest(this.testCallRequest);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testOutgoingRequest, OutgoingRequest),
                "Assert testOutgoingRequest extends OutgoingRequest");
            test.assertEqual(this.testOutgoingRequest.getCallRequest(), this.testCallRequest,
                "Assert #getCallRequest returns 'testCallRequest'");
            test.assertEqual(this.testOutgoingRequest.getState(), OutgoingRequest.State.READY,
                "Assert #getState defaults to OutgoingRequest.State.READY");
        }
    };

    var outgoingRequestChangeStateQueuedTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testCallRequest        = {};
            this.testOutgoingRequest    = new OutgoingRequest(this.testCallRequest);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testOutgoingRequest.getState(), OutgoingRequest.State.READY,
                "Assert #getState defaults to OutgoingRequest.State.READY");
            this.testOutgoingRequest.changeStateQueued();
            test.assertEqual(this.testOutgoingRequest.getState(), OutgoingRequest.State.QUEUED,
                "Assert #getState returns OutgoingRequest.State.QUEUED");
        }
    };

    var outgoingRequestChangeStateSentTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testCallRequest        = {};
            this.testOutgoingRequest    = new OutgoingRequest(this.testCallRequest);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testOutgoingRequest.getState(), OutgoingRequest.State.READY,
                "Assert #getState defaults to OutgoingRequest.State.READY");
            this.testOutgoingRequest.changeStateSent();
            test.assertEqual(this.testOutgoingRequest.getState(), OutgoingRequest.State.SENT,
                "Assert #getState returns OutgoingRequest.State.SENT");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(outgoingRequestInstantiationTest).with(
        test().name("OutgoingRequest - instantiation Test")
    );
    bugmeta.tag(outgoingRequestChangeStateQueuedTest).with(
        test().name("OutgoingRequest - #changeStateQueued Test")
    );
    bugmeta.tag(outgoingRequestChangeStateSentTest).with(
        test().name("OutgoingRequest - #changeStateSent Test")
    );
});
