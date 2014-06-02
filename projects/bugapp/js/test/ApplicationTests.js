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
//@Require('bugapp.Application')
//@Require('bugdouble.BugDouble')
//@Require('bugioc.ConfigurationTagProcessor')
//@Require('bugioc.ConfigurationTagScan')
//@Require('bugioc.IocContext')
//@Require('bugioc.ModuleTagProcessor')
//@Require('bugioc.ModuleTagScan')
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

    var Class                               = bugpack.require('Class');
    var Application                         = bugpack.require('bugapp.Application');
    var BugDouble                           = bugpack.require('bugdouble.BugDouble');
    var ConfigurationTagProcessor    = bugpack.require('bugioc.ConfigurationTagProcessor');
    var ConfigurationTagScan                   = bugpack.require('bugioc.ConfigurationTagScan');
    var IocContext                          = bugpack.require('bugioc.IocContext');
    var ModuleTagProcessor           = bugpack.require('bugioc.ModuleTagProcessor');
    var ModuleTagScan                          = bugpack.require('bugioc.ModuleTagScan');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var TestTag                      = bugpack.require('bugunit.TestTag');
    var BugYarn                             = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                             = BugMeta.context();
    var bugyarn                             = BugYarn.context();
    var stubObject                          = BugDouble.stubObject;
    var test                                = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestApplication", function(yarn) {
        yarn.wind({
            application: new Application()
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var applicationInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testApplication    = new Application();
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testApplication, Application),
                "Assert instance of Application");
            test.assertEqual(this.testApplication.getState(), Application.States.STOPPED,
                "Assert .state defaults to Application.States.STOPPED");
            test.assertTrue(Class.doesExtend(this.testApplication.getConfigurationTagScan(), ConfigurationTagScan),
                "Assert .configurationTagScan is an instance of ConfigurationTagScan");
            test.assertTrue(Class.doesExtend(this.testApplication.getIocContext(), IocContext),
                "Assert .iocContext is an instance of IocContext");
            test.assertTrue(Class.doesExtend(this.testApplication.getModuleTagScan(), ModuleTagScan),
                "Assert .moduleTagScan is an instance of ModuleTagScan");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(applicationInstantiationTest).with(
        test().name("Application - instantiation test")
    );
});
