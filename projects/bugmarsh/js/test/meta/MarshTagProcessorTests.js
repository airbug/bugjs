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
//@Require('bugmarsh.MarshTagProcessor')
//@Require('bugmeta.BugMeta')
//@Require('bugmeta.MetaContext')
//@Require('bugmeta.Tag')
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
    var MarshTagProcessor   = bugpack.require('bugmarsh.MarshTagProcessor');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var MetaContext         = bugpack.require('bugmeta.MetaContext');
    var Tag                 = bugpack.require('bugmeta.Tag');
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

    bugyarn.registerWinder("setupTestMarshTagProcessor", function(yarn) {
        yarn.spin([
            "setupTestMarshRegistry"
        ]);
        yarn.wind({
            marshTagProcessor: new MarshTagProcessor(this.marshRegistry)
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var marshTagProcessorInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin(["setupTestMarshRegistry"]);
            this.testMarshTagProcessor  = new MarshTagProcessor(this.marshRegistry);
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testMarshTagProcessor, MarshTagProcessor),
                "Assert testMarshTagProcessor is an instance of MarshTagProcessor");
            test.assertEqual(this.testMarshTagProcessor.getMarshRegistry(), this.marshRegistry,
                "Assert .marshRegistry was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(marshTagProcessorInstantiationTest).with(
        test().name("MarshTagProcessor - instantiation test")
    );
});
