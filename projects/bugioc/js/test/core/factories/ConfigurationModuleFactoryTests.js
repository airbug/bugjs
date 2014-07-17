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
//@Require('bugioc.ClassModuleFactory')
//@Require('bugioc.ConfigurationModuleFactory')
//@Require('bugioc.IocContext')
//@Require('bugioc.IocModule')
//@Require('bugioc.Module')
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

    var Class                       = bugpack.require('Class');
    var Obj                         = bugpack.require('Obj');
    var ClassModuleFactory          = bugpack.require('bugioc.ClassModuleFactory');
    var ConfigurationModuleFactory  = bugpack.require('bugioc.ConfigurationModuleFactory');
    var IocContext                  = bugpack.require('bugioc.IocContext');
    var IocModule                   = bugpack.require('bugioc.IocModule');
    var Module                      = bugpack.require('bugioc.Module');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var TestTag                     = bugpack.require('bugunit.TestTag');
    var BugYarn                     = bugpack.require('bugyarn.BugYarn');


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

    var configurationModuleFactoryInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testIocContext                 = new IocContext();
            this.testIocModule                  = new IocModule("testModuleName", IocModule.Scope.SINGLETON);
            this.testConfigurationIocModule     = new IocModule("testConfigurationModuleName", IocModule.Scope.SINGLETON);
            this.testConfigurationModuleFactory = new ConfigurationModuleFactory(this.testIocContext, this.testIocModule, this.testConfigurationIocModule);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testConfigurationModuleFactory.getIocContext(), this.testIocContext,
                "Assert .iocContext was set correctly");
            test.assertEqual(this.testConfigurationModuleFactory.getIocModule(), this.testIocModule,
                "Assert .iocModule was set correctly");
            test.assertEqual(this.testConfigurationModuleFactory.getConfigurationIocModule(), this.testConfigurationIocModule,
                "Assert .configurationIocModule was set correctly");
        }
    };

    var configurationModuleFactoryFactoryModuleTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.TestClass         = Class.extend(Obj, {});
            this.TestConfigurationClass         = Class.extend(Obj, {
                testModuleName: function() {
                    return new _this.TestClass();
                }
            });
            this.testIocContext                 = new IocContext();
            this.testConfigurationIocModule     = new IocModule("testConfigurationModuleName", IocModule.Scope.SINGLETON);
            this.testClassModuleFactory         = new ClassModuleFactory(this.testIocContext, this.testConfigurationIocModule, this.TestConfigurationClass.getClass());
            this.testConfigurationIocModule.setModuleFactory(this.testClassModuleFactory);
            this.testIocModule                  = new IocModule("testModuleName", IocModule.Scope.SINGLETON);
            this.testIocContext.registerIocModule(this.testConfigurationIocModule);
            this.testConfigurationModuleFactory = new ConfigurationModuleFactory(this.testIocContext, this.testIocModule, this.testConfigurationIocModule);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var module = this.testConfigurationModuleFactory.factoryModule();
            test.assertTrue(Class.doesExtend(module, Module),
                "Assert that ConfigurationModuleFactory returned an instance of Module");
            test.assertEqual(module.getIocModule(), this.testIocModule,
                "Assert that Module.iocModule is the testIocModule");
            test.assertTrue(Class.doesExtend(module.getInstance(), this.TestClass),
                "Assert Module.instance extends TestClass");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(configurationModuleFactoryInstantiationTest).with(
        test().name("ConfigurationModuleFactory - instantiation test")
    );
    bugmeta.tag(configurationModuleFactoryFactoryModuleTest).with(
        test().name("ConfigurationModuleFactory - #factoryModule test")
    );
});
