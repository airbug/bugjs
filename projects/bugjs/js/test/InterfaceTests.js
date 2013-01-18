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
var declareTest = {

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
annotate(declareTest).with(
    test().name("Interface declare test")
);
