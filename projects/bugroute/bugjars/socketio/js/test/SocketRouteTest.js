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

//@Require('bugmeta.BugMeta')
//@Require('bugroute.SocketRoute')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var SocketRoute     = bugpack.require('bugroute.SocketRoute');
    var TestTag         = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var socketRouteInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------
        setup: function(){
            this.socketName = "mySocketRoute";
            this.listener = function(){

            };
            this.socketRoute = new SocketRoute(this.socketName, this.listener);

        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------
        test: function(test){
            var name            = this.socketRoute.name;
            var listener        = this.socketRoute.listener;

            test.assertEqual(this.socketName, "mySocketRoute",
                "Asserts that the socketRoute's name is assigned properly on construction");
            test.assertEqual(this.listener, this.listener,
                "Asserts that the socketRoute's listener is assigned properly on construction");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(socketRouteInstantiationTest).with(
        test().name("SocketRoute - instantiation Test")
    );
});
