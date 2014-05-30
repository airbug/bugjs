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
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var TestAnnotation              = bugpack.require('bugunit.TestAnnotation');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta = BugMeta.context();
    var test = TestAnnotation.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     *
     */
    var entityManagerAnnotationInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.entityManagerAnnotation = EntityManagerAnnotation.entityManager("moduleName");
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.entityManagerAnnotation.getModuleName(), "moduleName",
                "Assert moduleName was successfully set");
            test.assertEqual(this.entityManagerAnnotation.getAnnotationType(), "EntityManager",
                "Assert annotationType was successfully set");
        }
    };
    bugmeta.annotate(entityManagerAnnotationInstantiationTest).with(
        test().name("EntityManagerAnnotation - instantiation test")
    );
});
