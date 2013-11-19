//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Set')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('tests.TypeValueSetsHelper')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Set                     = bugpack.require('Set');
var TypeUtil                = bugpack.require('TypeUtil');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var TypeValueSetsHelper     = bugpack.require('tests.TypeValueSetsHelper');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 *
 */
var typeComparisonTest = {

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        TypeUtilTests.runTypeTest("array", test);
        TypeUtilTests.runTypeTest("boolean", test);
        TypeUtilTests.runTypeTest("function", test);
        TypeUtilTests.runTypeTest("null", test);
        TypeUtilTests.runTypeTest("number", test);
        TypeUtilTests.runTypeTest("object", test);
        TypeUtilTests.runTypeTest("string", test);
        TypeUtilTests.runTypeTest("undefined", test);
    }

};
bugmeta.annotate(typeComparisonTest).with(
    test().name("TypeUtil Comparison Test")
);

var TypeUtilTests = {
    runTypeTest: function(typeToTest, runningTest) {
        var typeValueSets = TypeValueSetsHelper.getTypeValueSets();
        for (var type in typeValueSets) {
            var typeValueSet = typeValueSets[type];
            typeValueSet.forEach(function(typeValue) {
                if (type === typeToTest) {
                    runningTest.assertTrue(TypeUtilTests.testIsType(typeToTest, typeValue.value), "Assert " + typeValue.name + " is " + typeToTest);
                } else {
                    runningTest.assertFalse(TypeUtilTests.testIsType(typeToTest, typeValue.value), "Assert " + typeValue.name + " is NOT " + typeToTest)
                }
            });
        }
    },

    testIsType: function(type, value) {
        if (type === "array") {
            return TypeUtil.isArray(value);
        } else if (type === "boolean") {
            return TypeUtil.isBoolean(value);
        } else if (type === "function") {
            return TypeUtil.isFunction(value);
        } else if (type === "null") {
            return TypeUtil.isNull(value);
        } else if (type === "number") {
            return TypeUtil.isNumber(value);
        } else if (type === "object") {
            return TypeUtil.isObject(value);
        } else if (type === "string") {
            return TypeUtil.isString(value);
        } else if (type === "undefined") {
            return TypeUtil.isUndefined(value);
        }
    }
};


/**
 *
 */
var typeUtilToTypeTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testBoolean    = false;
        this.testNumber     = 123;
        this.testString     = "test";
        this.testSet        = new Set();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(TypeUtil.toType(this.testBoolean), "boolean",
            "Assert toType returns 'boolean' for boolean");
        test.assertEqual(TypeUtil.toType(this.testNumber), "number",
            "Assert toType returns 'number' for number");
        test.assertEqual(TypeUtil.toType(this.testString), "string",
            "Assert toType returns 'string' for string");

        //NOTE BRN: All class instances should return as 'object' types

        test.assertEqual(TypeUtil.toType(this.testSet), "object",
            "Assert toType returns 'object' for Set instance");
    }

};
bugmeta.annotate(typeUtilToTypeTest).with(
    test().name("TypeUtil - toType Test")
);
