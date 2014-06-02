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

//@Require('bugentity.SchemaProperty')
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

    var SchemaProperty  = bugpack.require('bugentity.SchemaProperty');
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

    bugyarn.registerWeaver("testSchemaProperty", function(yarn, args) {
        return new SchemaProperty(args[0], args[1], args[2]);
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var schemaPropertyInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testName       = "testName";
            this.testType       = "testType";
            this.testOptions    = {
                collectionOf: "testCollectionOf",
                id: true,
                indexed: true,
                populates: true,
                stored: true,
                unique: true
            };
            this.testSchemaProperty = new SchemaProperty(this.testName, this.testType, this.testOptions);
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testSchemaProperty.getCollectionOf(), this.testOptions.collectionOf,
                "Assert SchemaProperty.collectionOf was set correctly");
            test.assertEqual(this.testSchemaProperty.getName(), this.testName,
                "Assert SchemaProperty.name was set correctly");
            test.assertEqual(this.testSchemaProperty.getType(), this.testType,
                "Assert SchemaProperty.type was set correctly");
            test.assertEqual(this.testSchemaProperty.isId(), this.testOptions.id,
                "Assert SchemaProperty.id was set correctly");
            test.assertEqual(this.testSchemaProperty.isIndexed(), this.testOptions.indexed,
                "Assert SchemaProperty.indexed was set correctly");
            test.assertEqual(this.testSchemaProperty.isPopulates(), this.testOptions.populates,
                "Assert SchemaProperty.populates was set correctly");
            test.assertEqual(this.testSchemaProperty.isStored(), this.testOptions.stored,
                "Assert SchemaProperty.stored was set correctly");
            test.assertEqual(this.testSchemaProperty.isUnique(), this.testOptions.unique,
                "Assert SchemaProperty.unique was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(schemaPropertyInstantiationTest).with(
        test().name("SchemaProperty - instantiation Test")
    );
});
