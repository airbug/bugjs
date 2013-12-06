//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('ArgUtil')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil                 = bugpack.require('ArgUtil');
var Obj                     = bugpack.require('Obj');
var TypeUtil                = bugpack.require('TypeUtil');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


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
var argUtilToArrayTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testArg1       = "testArg1";
        this.testArg2       = 2;
        this.testFunction = function() {
            return ArgUtil.toArray(arguments);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var results = this.testFunction(this.testArg1, this.testArg2);
        test.assertTrue(TypeUtil.isArray(results),
            "Assert that ArgUtil returned an array");
        test.assertEqual(results[0], this.testArg1,
            "Assert that index 0 has testArg1");
        test.assertEqual(results[1], this.testArg2,
            "Assert that index 1 has testArg2");
    }

};
bugmeta.annotate(argUtilToArrayTest).with(
    test().name("ArgUtil - toArray test")
);


/**
 *
 */
var argUtilToArrayNoArgumentsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testFunction = function() {
            return ArgUtil.toArray(arguments);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var results = this.testFunction();
        test.assertTrue(TypeUtil.isArray(results),
            "Assert that ArgUtil returned an array");
        test.assertEqual(results.length, 0,
            "Assert that the array is empty");
    }

};
bugmeta.annotate(argUtilToArrayNoArgumentsTest).with(
    test().name("ArgUtil - toArray no arguments test")
);


/**
 *
 */
var argUtilProcessNoArgumentsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testFunction = function() {
            return ArgUtil.process(arguments, []);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var argsObject = this.testFunction();
        var properties = Obj.getProperties(argsObject);
        test.assertTrue(TypeUtil.isObject(argsObject),
            "Assert that ArgUtil returned an object");
        test.assertEqual(properties.length, 0,
            "Assert that returned argsObject is empty");
    }

};
bugmeta.annotate(argUtilProcessNoArgumentsTest).with(
    test().name("ArgUtil - #process no arguments test")
);


/**
 *
 */
var argUtilProcessNoDescriptionsThrowsBugTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testFunction = function() {
            return ArgUtil.process(arguments);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        test.assertThrows(function() {
            _this.testFunction();
        }, "Assert that running #process without a descriptions array throws a Bug");
    }

};
bugmeta.annotate(argUtilProcessNoDescriptionsThrowsBugTest).with(
    test().name("ArgUtil - #process no descriptions throws Bug test")
);


/**
 *
 */
var argUtilProcessOneArgumentSuccessTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue  = "testValue";
        this.testArgName   = "testArgName";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var argsObject = this.testFunction(this.testValue);
        var properties = Obj.getProperties(argsObject);
        test.assertTrue(TypeUtil.isObject(argsObject),
            "Assert that ArgUtil returned an object");
        test.assertEqual(properties.length, 1,
            "Assert that returned argsObject has 1 property");
        test.assertEqual(argsObject.testArgName, this.testValue,
            "Assert that argsObject.testName is testValue")
    }

};
bugmeta.annotate(argUtilProcessOneArgumentSuccessTest).with(
    test().name("ArgUtil - #process one argument success test")
);


/**
 *
 */
var argUtilProcessMultipleArgumentsSuccessTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = "testValue1";
        this.testArgName1   = "testArgName1";
        this.testValue2     = "testValue2";
        this.testArgName2   = "testArgName2";
        this.testValue3     = "testValue3";
        this.testArgName3   = "testArgName3";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1},
                {name: _this.testArgName2},
                {name: _this.testArgName3}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var argsObject = this.testFunction(this.testValue1, this.testValue2, this.testValue3);
        var properties = Obj.getProperties(argsObject);
        test.assertTrue(TypeUtil.isObject(argsObject),
            "Assert that ArgUtil returned an object");
        test.assertEqual(properties.length, 3,
            "Assert that returned argsObject has 1 property");
        test.assertEqual(argsObject.testArgName1, this.testValue1,
            "Assert that argsObject.testArgName1 is testValue1");
        test.assertEqual(argsObject.testArgName2, this.testValue2,
            "Assert that argsObject.testArgName2 is testValue2");
        test.assertEqual(argsObject.testArgName3, this.testValue3,
            "Assert that argsObject.testArgName3 is testValue3")
    }

};
bugmeta.annotate(argUtilProcessMultipleArgumentsSuccessTest).with(
    test().name("ArgUtil - #process multiple argument success test")
);


/**
 *
 */
var argUtilProcessTooFewDescriptionsBugTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = "testValue1";
        this.testArgName1   = "testArgName1";
        this.testValue2     = "testValue2";
        this.testArgName2   = "testArgName2";
        this.testValue3     = "testValue3";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1},
                {name: _this.testArgName2}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.assertThrows(function() {
            _this.testFunction(_this.testValue1, _this.testValue2, _this.testValue3);
        }, "Assert that a Bug is thrown when there are fewer descriptions than arguments");
    }

};
bugmeta.annotate(argUtilProcessMultipleArgumentsSuccessTest).with(
    test().name("ArgUtil - #process multiple argument success test")
);

/**
 *
 */
var argUtilProcessMultipleArgumentsOptionalArgSuccessTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = "testValue1";
        this.testArgName1   = "testArgName1";
        this.testArgName2   = "testArgName2";
        this.testValue3     = "testValue3";
        this.testArgName3   = "testArgName3";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1},
                {name: _this.testArgName2, optional: true},
                {name: _this.testArgName3}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var argsObject = this.testFunction(this.testValue1, this.testValue3);
        var properties = Obj.getProperties(argsObject);
        test.assertTrue(TypeUtil.isObject(argsObject),
            "Assert that ArgUtil returned an object");
        test.assertEqual(properties.length, 3,
            "Assert that returned argsObject has 3 properties");
        test.assertEqual(argsObject.testArgName1, this.testValue1,
            "Assert that argsObject.testArgName1 is testValue1");
        test.assertEqual(argsObject.testArgName2, undefined,
            "Assert that argsObject.testArgName2 is undefined");
        test.assertEqual(argsObject.testArgName3, this.testValue3,
            "Assert that argsObject.testArgName3 is testValue3")
    }

};
bugmeta.annotate(argUtilProcessMultipleArgumentsOptionalArgSuccessTest).with(
    test().name("ArgUtil - #process multiple arguments with optional arg success test")
);

/**
 *
 */
var argUtilProcessMultipleArgumentsOptionalArgArgMissingTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = "testValue1";
        this.testArgName1   = "testArgName1";
        this.testArgName2   = "testArgName2";
        this.testArgName3   = "testArgName3";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1},
                {name: _this.testArgName2, optional: true},
                {name: _this.testArgName3}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        test.assertThrows(function() {
            _this.testFunction(_this.testValue1);
        }, "Assert an error is thrown when there is a missing argument with an optional argument");
    }

};
bugmeta.annotate(argUtilProcessMultipleArgumentsOptionalArgArgMissingTest).with(
    test().name("ArgUtil - #process multiple arguments with optional arg and one missing arg test")
);

/**
 *
 */
var argUtilProcessMultipleArgumentsOptionalArgWitDefaultSuccessTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = "testValue1";
        this.testArgName1   = "testArgName1";
        this.testArgName2   = "testArgName2";
        this.testDefault2   = "testDefault2";
        this.testValue3     = "testValue3";
        this.testArgName3   = "testArgName3";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1},
                {name: _this.testArgName2, optional: true, default: _this.testDefault2},
                {name: _this.testArgName3}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var argsObject = this.testFunction(this.testValue1, this.testValue3);
        var properties = Obj.getProperties(argsObject);
        test.assertTrue(TypeUtil.isObject(argsObject),
            "Assert that ArgUtil returned an object");
        test.assertEqual(properties.length, 3,
            "Assert that returned argsObject has 3 properties");
        test.assertEqual(argsObject.testArgName1, this.testValue1,
            "Assert that argsObject.testArgName1 is testValue1");
        test.assertEqual(argsObject.testArgName2, this.testDefault2,
            "Assert that argsObject.testArgName2 is testDefault2");
        test.assertEqual(argsObject.testArgName3, this.testValue3,
            "Assert that argsObject.testArgName3 is testValue3")
    }

};
bugmeta.annotate(argUtilProcessMultipleArgumentsOptionalArgWitDefaultSuccessTest).with(
    test().name("ArgUtil - #process multiple arguments with optional arg and default success test")
);
