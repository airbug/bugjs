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
//@Require('bugroute.BugCallRouter')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var BugDouble           = bugpack.require('bugdouble.BugDouble');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var BugCallRouter       = bugpack.require('bugroute.BugCallRouter');
    var TestTag      = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var spyOnFunction       = BugDouble.spyOnFunction;
    var test                = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var bugCallRouterInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testBugCallRouter   = new BugCallRouter();
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(this.testBugCallRouter.getRouteMap().isEmpty(),
                "Assert routeMap is empty");

        }
    };
    bugmeta.tag(bugCallRouterInstantiationTest).with(
        test().name("BugCallRouter - instantiation Test")
    );
});
