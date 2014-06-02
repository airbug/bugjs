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
//@Require('bugmarsh.Marsh')
//@Require('bugmarsh.MarshProperty')
//@Require('bugmeta.BugMeta')
//@Require('bugmeta.MetaContext')
//@Require('bugmeta.Tag')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Marsh           = bugpack.require('bugmarsh.Marsh');
    var MarshProperty   = bugpack.require('bugmarsh.MarshProperty');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var MetaContext     = bugpack.require('bugmeta.MetaContext');
    var Tag             = bugpack.require('bugmeta.Tag');
    var TestTag         = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var marshInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testMarshClass     = function() {};
            this.testMarshName      = "testMarshName";
            this.testMarsh          = new Marsh(this.testMarshClass, this.testMarshName);
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testMarsh, Marsh),
                "Assert testMarsh is an instance of Marsh");
            test.assertEqual(this.testMarsh.getMarshClass(), this.testMarshClass,
                "Assert marshClass was set correctly");
            test.assertEqual(this.testMarsh.getMarshName(), this.testMarshName,
                "Assert marshName was set correctly");
            test.assertTrue(this.testMarsh.getMarshPropertyList().isEmpty(),
                "Assert that marshPropertyList is empty");
        }
    };

    var marshAddPropertyTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testMarshClass     = function() {};
            this.testMarshName      = "testMarshName";
            this.testMarsh          = new Marsh(this.testMarshClass, this.testMarshName);
            this.testPropertyName   = "testPropertyName";
            this.testMarshProperty  = new MarshProperty(this.testPropertyName);
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testMarsh.addProperty(this.testMarshProperty);
            test.assertTrue(this.testMarsh.hasPropertyByName(this.testMarshProperty.getPropertyName()),
                "Assert that testMarsh now has the property");
            test.assertEqual(this.testMarsh.getPropertyByName(this.testPropertyName), this.testMarshProperty,
                "Assert that testMarsh#getPropertyByName returns the testProperty");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(marshInstantiationTest).with(
        test().name("Marsh - instantiation test")
    );
    bugmeta.tag(marshAddPropertyTest).with(
        test().name("Marsh - #addProperty test")
    );
});
