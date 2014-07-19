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
//@Require('bugioc.ModuleProcessorTag')
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
    var Obj                 = bugpack.require('Obj');
    var ModuleProcessorTag  = bugpack.require('bugioc.ModuleProcessorTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');
    var BugYarn             = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var bugyarn     = BugYarn.context();
    var test        = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var moduleProcessorTagInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testModuleProcessorTag = ModuleProcessorTag.moduleProcessor()
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testModuleProcessorTag, ModuleProcessorTag),
                "Assert instance of ModuleProcessorTag");
        }
    };

    var moduleProcessorTagDeprocessMethodAndProcessMethodTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testProcessMethodName      = "testProcessMethodName";
            this.testDeprocessMethodName    = "testDeprocessMethodName";
            this.testModuleProcessorTag     = ModuleProcessorTag
                .moduleProcessor()
                .deprocessMethod(this.testDeprocessMethodName)
                .processMethod(this.testProcessMethodName);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testModuleProcessorTag.getDeprocessMethodName(), this.testDeprocessMethodName,
                "Assert that ModuleProcessorTag.deprocessMethodName was set correctly");
            test.assertEqual(this.testModuleProcessorTag.getProcessMethodName(), this.testProcessMethodName,
                "Assert that ModuleProcessorTag.processMethodName was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(moduleProcessorTagInstantiationTest).with(
        test().name("ModuleProcessorTag - instantiation test")
    );
    bugmeta.tag(moduleProcessorTagDeprocessMethodAndProcessMethodTest).with(
        test().name("ModuleProcessorTag - #deprocessMethod and #processMethod test")
    );
});
