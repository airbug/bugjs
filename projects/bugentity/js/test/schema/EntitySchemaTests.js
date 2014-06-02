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
//@Require('bugentity.EntitySchema')
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

    var Class           = bugpack.require('Class');
    var EntitySchema    = bugpack.require('bugentity.EntitySchema');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');
    var BugYarn         = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var bugyarn         = BugYarn.context();
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWeaver("testEntitySchema", function(yarn, args) {
        return new EntitySchema(args[0], args[1], args[2]);
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var entitySchemaInstantiationNoOptionsTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testEntityClass        = new Class();
            this.testEntityName         = "testEntityName";
            this.testEntitySchema       = new EntitySchema(this.testEntityClass, this.testEntityName);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testEntitySchema, EntitySchema),
                "Assert instance of EntitySchema");
            test.assertEqual(this.testEntitySchema.getEntityClass(), this.testEntityClass,
                "Assert .entityClass was set correctly");
            test.assertEqual(this.testEntitySchema.getEntityName(), this.testEntityName,
                "Assert .entityName was set correctly");
            test.assertEqual(this.testEntitySchema.getEntityStored(), true,
                "Assert .entityStore defaults to true");
            test.assertEqual(this.testEntitySchema.getEntityEmbedded(), false,
                "Assert .entityEmbedded defaults to false");
        }
    };

    var entitySchemaInstantiationWithOptionsTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testEntityClass        = new Class();
            this.testEntityName         = "testEntityName";
            this.testEntityOptions      = {
                embedded: true,
                stored: false
            };
            this.testEntitySchema       = new EntitySchema(this.testEntityClass, this.testEntityName, this.testEntityOptions);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testEntitySchema, EntitySchema),
                "Assert instance of EntitySchema");
            test.assertEqual(this.testEntitySchema.getEntityClass(), this.testEntityClass,
                "Assert .entityClass was set correctly");
            test.assertEqual(this.testEntitySchema.getEntityName(), this.testEntityName,
                "Assert .entityName was set correctly");
            test.assertEqual(this.testEntitySchema.getEntityStored(), false,
                "Assert .entityStored was set correctly");
            test.assertEqual(this.testEntitySchema.getEntityEmbedded(), true,
                "Assert .entityEmbedded was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(entitySchemaInstantiationNoOptionsTest).with(
        test().name("EntitySchema - instantiation with no options test")
    );
    bugmeta.tag(entitySchemaInstantiationWithOptionsTest).with(
        test().name("EntitySchema - instantiation with options test")
    );
});
