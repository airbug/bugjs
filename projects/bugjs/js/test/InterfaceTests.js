//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Interface')
//@Require('TypeUtil')
//@Require('annotate.Annotate')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Interface =         bugpack.require('Interface');
var TypeUtil =          bugpack.require('TypeUtil');
var Annotate =          bugpack.require('annotate.Annotate');
var TestAnnotation =    bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var test = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 *
 */
var interfaceDeclareTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.NewInterface = Interface.declare({
            someFunction1: function() {

            },
            someFunction2: function() {

            }
        });
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(TypeUtil.isFunction(this.NewInterface.prototype.someFunction1),
            "Assert function added to interface is function and is present in interface prototype");
        test.assertTrue(TypeUtil.isFunction(this.NewInterface.prototype.someFunction2),
            "Assert second function added to interface is function and is present in interface prototype");
    }
};
annotate(interfaceDeclareTest).with(
    test().name("Interface declare test")
);


/**
 *
 */
var interfaceExtendTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.NewInterface = Interface.declare({
            someFunction1: function() {

            },
            someFunction2: function() {

            }
        });

        this.SubInterface = Interface.extend(this.NewInterface, {
            someFunction3: function() {

            }
        });
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(TypeUtil.isFunction(this.NewInterface.prototype.someFunction1),
            "Assert function added to interface is function and is present in interface prototype");
        test.assertTrue(TypeUtil.isFunction(this.NewInterface.prototype.someFunction2),
            "Assert second function added to interface is function and is present in interface prototype");

        test.assertTrue(TypeUtil.isFunction(this.SubInterface.prototype.someFunction2),
            "Assert first function added to sub interface is function and is present in interface prototype");
        test.assertTrue(TypeUtil.isFunction(this.SubInterface.prototype.someFunction2),
            "Assert second function added to sub interface is function and is present in interface prototype");
        test.assertTrue(TypeUtil.isFunction(this.SubInterface.prototype.someFunction2),
            "Assert third function added to sub interface is function and is present in interface prototype");
    }
};
annotate(interfaceExtendTest).with(
    test().name("Interface extend test")
);
