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
//@Require('Obj')
//@Require('bugmarsh.MarshTag')
//@Require('bugmarsh.MarshTagScan')
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

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var MarshTag        = bugpack.require('bugmarsh.MarshTag');
    var MarshTagScan    = bugpack.require('bugmarsh.MarshTagScan');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var MetaContext     = bugpack.require('bugmeta.MetaContext');
    var Tag             = bugpack.require('bugmeta.Tag');
    var TestTag         = bugpack.require('bugunit.TestTag');
    var BugYarn         = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var bugyarn         = BugYarn.context();
    var marsh           = MarshTag.marsh;
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestMarshTagScan", function(yarn) {
        yarn.spin([
            "setupTestMetaContext",
            "setupTestMarshTagProcessor"
        ]);
        yarn.wind({
            marshTagScan: new MarshTagScan(this.metaContext, this.marshTagProcessor)
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var marshTagScanInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestMetaContext",
                "setupTestMarshTagProcessor"
            ]);
            this.testMarshTagScan   = new MarshTagScan(this.metaContext, this.marshTagProcessor);
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testMarshTagScan, MarshTagScan),
                "Assert testMarshTagScan is an instance of MarshTagScan");
            test.assertEqual(this.testMarshTagScan.getMetaContext(), this.metaContext,
                "Assert .metaContext was set correctly");
            test.assertEqual(this.testMarshTagScan.getTagProcessor(), this.marshTagProcessor,
                "Assert .tagProcessor was set correctly");
        }
    };

    var marshTagScanScanAllTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestMarshTagScan"
            ]);
            this.TestClass = Class.extend(Obj, {});
            this.metaContext.tag(this.TestClass).with(
                marsh("TestClass")
            );
            this.marshRegistry.configureModule();
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.marshTagScan.scanAll();
            test.assertTrue(this.marshRegistry.hasMarshForClass(this.TestClass.getClass()),
                "Assert marsh was added for TestClass");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(marshTagScanInstantiationTest).with(
        test().name("MarshTagScan - instantiation test")
    );
    bugmeta.tag(marshTagScanScanAllTest).with(
        test().name("MarshTagScan - #scanAll test")
    );
});
