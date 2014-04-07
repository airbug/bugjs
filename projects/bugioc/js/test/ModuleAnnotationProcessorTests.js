//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.ModuleAnnotationProcessor')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var ModuleAnnotationProcessor   = bugpack.require('bugioc.ModuleAnnotationProcessor');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestAnnotation              = bugpack.require('bugunit.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var test                        = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 *
 */
var moduleAnnotationProcessorFactoryIocModuleTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testArgRef = "argRef";
        this.testModuleName = "moduleName";
        this.testPropertyName = "propertyName";
        this.testPropertyRef = "propertyRef";
        this.moduleAnnotationProcessor = new ModuleAnnotationProcessor({});
        this.moduleAnnotation = ModuleAnnotation.module(this.testModuleName);
        this.moduleAnnotation.args([
            ArgAnnotation.arg().ref(this.testArgRef)
        ]);
        this.moduleAnnotation.properties([
            PropertyAnnotation.property(this.testPropertyName).ref(this.testPropertyRef)
        ]);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        /** @type {IocModule} */
        var iocModule = this.moduleAnnotationProcessor.factoryIocModule(this.moduleAnnotation);

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
bugmeta.annotate(moduleAnnotationProcessorFactoryIocModuleTest).with(
    test().name("ModuleAnnotationProcessor - factoryIocModule test")
);
