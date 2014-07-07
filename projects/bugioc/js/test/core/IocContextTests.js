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
//@Require('bugioc.IocContext')
//@Require('bugioc.IocModule')
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

    var Class       = bugpack.require('Class');
    var IocContext  = bugpack.require('bugioc.IocContext');
    var IocModule   = bugpack.require('bugioc.IocModule');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');
    var TestTag     = bugpack.require('bugunit.TestTag');
    var BugYarn     = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var bugyarn     = BugYarn.context();
    var test        = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestIocContext", function(yarn) {
        yarn.wind({
            iocContext: new IocContext()
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var iocContextInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testIocContext   = new IocContext();
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testIocContext, IocContext),
                "Assert instance of IocContext");
        }
    };

    /**
     * This tests
     * 1) that the callback for start() is called when there are no configs
     */
    var iocContextStartWithNoConfigurationsTest = {

        async: true,


        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.iocContext = new IocContext();
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.iocContext.start(function() {
                test.assertTrue(true,
                    "Assert iocContext.initialize() callback was successfully called when there's no configs");
                test.completeTest();
            })
        }
    };

    /**
     * This tests
     * 1) that a new module is returned when using prototype scope
     */
    var iocContextNewModuleFromPrototypeScopeTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.iocContext             = new IocContext();
            this.testModuleName         = "testModuleName";
            this.testModuleScope        = IocModule.Scope.PROTOTYPE;
            this.testIocModule          = new IocModule(this.testModuleName, this.testModuleScope);
            this.iocContext.registerIocModule(this.testIocModule);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var module1 = this.iocContext.generateModuleByName(this.testModuleName);
            var module2 = this.iocContext.generateModuleByName(this.testModuleName);
            test.assertNotEqual(module1, module2,
                "Assert that module1 and module2 are not the same");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(iocContextInstantiationTest).with(
        test().name("IocContext - instantiation test")
    );
    bugmeta.tag(iocContextStartWithNoConfigurationsTest).with(
        test().name("IocContext - start() with no configurations test")
    );
    bugmeta.tag(iocContextNewModuleFromPrototypeScopeTest).with(
        test().name("IocContext - new module when using prototype scope test")
    )
});
