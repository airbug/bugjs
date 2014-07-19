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
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.ModuleTagProcessor')
//@Require('bugioc.PropertyTag')
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
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var ModuleTagProcessor  = bugpack.require('bugioc.ModuleTagProcessor');
    var PropertyTag         = bugpack.require('bugioc.PropertyTag');
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

    /**
     *
     */
    var moduleTagProcessorFactoryIocModuleTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testArgRef = "argRef";
            this.testModuleName = "moduleName";
            this.testPropertyName = "propertyName";
            this.testPropertyRef = "propertyRef";
            this.moduleTagProcessor = new ModuleTagProcessor({});
            this.moduleTag = ModuleTag.module(this.testModuleName);
            this.moduleTag.args([
                ArgTag.arg().ref(this.testArgRef)
            ]);
            this.moduleTag.properties([
                PropertyTag.property(this.testPropertyName).ref(this.testPropertyRef)
            ]);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            /** @type {IocModule} */
            var iocModule = this.moduleTagProcessor.factoryIocModule(this.moduleTag);

            test.assertEqual(iocModule.getName(), this.testModuleName,
                "Assert moduleName was successfully set");
            test.assertFalse(iocModule.getIocArgList().isEmpty(),
                "Assert iocArgList is not empty");
            if (!iocModule.getIocArgList().isEmpty()) {
                /** @type {IocArg} */
                var iocArg = iocModule.getIocArgList().getAt(0);
                test.assertEqual(iocArg.getRef(), this.testArgRef,
                    "Assert iocArgRef was correctly set");
            }
            test.assertFalse(iocModule.getIocPropertySet().isEmpty(),
                "Assert iocPropertySet is not empty");
            if (!iocModule.getIocPropertySet().isEmpty()) {
                /** @type {IocProperty} */
                var iocProperty = iocModule.getIocPropertySet().toArray()[0];
                test.assertEqual(iocProperty.getName(), this.testPropertyName,
                    "Assert iocPropertyName was correctly set");
                test.assertEqual(iocProperty.getRef(), this.testPropertyRef,
                    "Assert iocPropertyRef was correctly set");
            }
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(moduleTagProcessorFactoryIocModuleTest).with(
        test().name("ModuleTagProcessor - #factoryIocModule test")
    );
});
