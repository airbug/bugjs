//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Annotate = require('../../lib/Annotate');
var Interface = require('../../lib/Interface');
var TestAnnotation = require('../../lib/unit/TestAnnotation');
var TypeUtil = require('../../lib/TypeUtil');


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
