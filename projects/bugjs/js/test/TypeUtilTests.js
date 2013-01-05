//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Annotate = require('../../lib/Annotate');
var TestAnnotation = require('../../lib/unit/TestAnnotation');
var TypeUtil = require('../../lib/TypeUtil');
var TypeValueSetsHelper = require('../helper/TypeValueSetsHelper');


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
annotate(typeComparisonTest).with(
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
