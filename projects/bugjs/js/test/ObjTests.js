//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Obj')
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

var Obj =               bugpack.require('Obj');
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
 * This tests
 * 1) Instantiation of a basic Obj
 * 2) That the getClass() value is Obj when an Obj is instantiated
 */
var objInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testObject1 = new Obj();
        this.testObject2 = new Obj();
    },

    
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testObject1.getClass(), Obj,
            "Assert object1's class is Obj");
        test.assertEqual(this.testObject2.getClass(), Obj,
            "Assert object2's class is Obj");
        test.assertNotEqual(this.testObject1.getInternalId(), this.testObject2.getInternalId(),
            "Assert id of both objects are different");
    }
};
annotate(objInstantiationTest).with(
    test().name("Obj instantiation test")
);


/**
 * This tests
 * 1) The hashCode method of an instantiated Obj
 * 2) The static hashCode method of the Obj class
 * 3) That the hashCode is the same when run multiple times
 * 4) That the Obj.hashCode and the instantiated object hashCode match
 */
var objHashCodeTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testObject = new Obj();
        this.testObjectHashCode = this.testObject.hashCode();
        this.testStaticObjectHashCode = Obj.hashCode(this.testObject);
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        
        // NOTE BRN: There is no guarantee that the hash codes of two different objects are different. But we can
        // verify that they are numeric at least.
    
        test.assertTrue(TypeUtil.isNumber(this.testObjectHashCode),
            "Assert object's hash code is numeric");
        test.assertTrue(TypeUtil.isNumber(this.testObjectHashCode),
            "Assert value returned from Obj.hashCode is numeric");
        test.assertEqual(this.testObject.hashCode(), this.testObjectHashCode,
            "Assert object's hash code is the same when run multiple times");
        test.assertEqual(this.testObjectHashCode, this.testStaticObjectHashCode,
            "Assert Obj.hashCode and the instantiated object hashCode match");
    }
};
annotate(objHashCodeTest).with(
    test().name("Obj hashCode test")
);


/**
 * This tests
 * 1) The static equals method of the Obj class
 */
var objEqualsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testObject1 = new Obj();
        this.testObject2 = new Obj();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Obj.equals("value1", "value1"),
            "Assert equals returns true for two matching strings");
        test.assertTrue(Obj.equals(123, 123),
            "Assert equals returns true for two matching numbers");
        test.assertTrue(Obj.equals(0, 0),
            "Assert equals returns true for two 0 numbers");
        test.assertTrue(Obj.equals(null, null),
            "Assert equals returns true for two null values");
        test.assertTrue(Obj.equals(undefined, undefined),
            "Assert equals returns true for two undefined values");
        test.assertTrue(Obj.equals(this.testObject1, this.testObject1),
            "Assert two of the same Obj instance are equal");
    
        //TODO BRN (QUESTION): Do these assertions make sense? Should we do some sort of auto conversion for these values?
        test.assertFalse(Obj.equals(new String("abc123"), "abc123"),
            "Assert equals returns false for a string object and string literal that are the same string");
        test.assertFalse(Obj.equals(new Number(123), 123),
            "Assert equals returns false for number object and number literal that are the same number");
        test.assertFalse(Obj.equals(new Number(123), new Number(123)),
            "Assert equals returns false for two number objects that are the same number");

        test.assertFalse(Obj.equals(this.testObject1, this.testObject2),
            "Assert two different Obj instances are not equal");
    }
};
annotate(objEqualsTest).with(
    test().name("Obj equals test")
);


/**
 * This tests
 * 1) The static clone method of the Obj class
 */
var objCloneTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testObj = new Obj();
        this.testObj.someValue =  "testValue";
        this.genericObject = {
            aValue: "myValue"
        };
        this.valuesThatPassThrough = [
            "",
            "string",
            0,
            0.123,
            123,
            true,
            false,
            new String("another string")
        ]
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var cloneObj = Obj.clone(this.testObj);
        test.assertNotEqual(cloneObj, this.testObj,
            "Assert that the clone Obj does not equal the original Obj");
        test.assertEqual(cloneObj.testValue, this.testObj.testValue,
            "Assert that testValue was copied to the Obj clone");

        var cloneGenericObject = Obj.clone(this.genericObject);
        test.assertNotEqual(cloneGenericObject, this.genericObject,
            "Assert the cloned generic object and the original generic object are not equal.");
        test.assertEqual(cloneGenericObject.aValue, this.genericObject.aValue,
            "Assert the values were coppied from the original generic object to the cloned generic object");

        this.valuesThatPassThrough.forEach(function(passThroughValue) {
            var valueClone = Obj.clone(passThroughValue);
            test.assertEqual(valueClone, passThroughValue,
                "Assert value " + passThroughValue + " passed through the clone function and simply returned the " +
                    "original value");
        })
    }
};
annotate(objCloneTest).with(
    test().name("Obj clone test")
);


/**
 * This tests..
 * 1) That the forIn function correctly iterates over an object and sets the context correctly
 */
var objForInIterationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testObject = {
            prop1: "value1",
            prop2: "value2",
            prop3: "value3"
        };
        this.testContext = {
            contextTrue: true
        };
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var iteratedProps = [];
        var iteratedValues = [];
        Obj.forIn(this.testObject, function(prop, value) {
            iteratedProps.push(prop);
            iteratedValues.push(value);
            test.assertTrue(this.contextTrue,
                "Assert that we are executing within the correct context");
        }, this.testContext);

        test.assertTrue((iteratedProps.length === 3),
            "Assert we iterated over 3 properties");
        test.assertTrue((iteratedValues.length === 3),
            "Assert we iterated over 3 values");

        var expectedProps = [
            "prop1",
            "prop2",
            "prop3"
        ];
        for (var i = 0, size = iteratedProps.length; i < size; i++) {
            var iteratedProp = iteratedProps[i];
            var expectedPropIndex = expectedProps.indexOf(iteratedProp);
            test.assertTrue((expectedPropIndex > -1),
                "Assert prop was in the expectedProps");
            expectedProps.splice(expectedPropIndex, 1);
            test.assertEqual(iteratedValues[i], this.testObject[iteratedProp],
                "Assert the value that was iterated is the one that corresponds to the property");
        }
    }
};
annotate(objForInIterationTest).with(
    test().name("Obj forIn iteration test")
);


/**
 * This tests..
 * 1) That the forIn function correctly iterates over an object in IE8
 * 2) dont enum properties are not correctly iterated when they are overridden in IE8
 */
var objForInIterationDontEnumPropertiesTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testObject = {
            prop1: "value1",
            prop2: "value2",
            prop3: "value3"
        };
        Obj.hasOwnProperty = function(prop) {
            if (prop === 'toString') {
                return true;
            } else {
                return this.hasOwnProperty(prop);
            }
        };
        this.originalIsDontEnumSkipped = Obj.isDontEnumSkipped;
        Obj.isDontEnumSkipped = true;
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var iteratedProps = [];
        var iteratedValues = [];
        Obj.forIn(this.testObject, function(prop, value) {
            iteratedProps.push(prop);
            iteratedValues.push(value);
        });

        test.assertTrue((iteratedProps.length === 4),
            "Assert we iterated over 4 properties");
        test.assertTrue((iteratedValues.length === 4),
            "Assert we iterated over 4 values");

        var expectedProps = [
            "prop1",
            "prop2",
            "prop3",
            "toString"
        ];
        for (var i = 0, size = iteratedProps.length; i < size; i++) {
            var iteratedProp = iteratedProps[i];
            var expectedPropIndex = expectedProps.indexOf(iteratedProp);
            test.assertTrue((expectedPropIndex > -1),
                "Assert prop was in the expectedProps");
            expectedProps.splice(expectedPropIndex, 1);
            test.assertEqual(iteratedValues[i], this.testObject[iteratedProp],
                "Assert the value that was iterated is the one that corresponds to the property");
        }
    },


    // Tear Down Test
    //-------------------------------------------------------------------------------

    tearDown: function() {
        Obj.hasOwnProperty = Object.prototype.hasOwnProperty;
        Obj.isDontEnumSkipped = this.originalIsDontEnumSkipped;
    }
};
annotate(objForInIterationDontEnumPropertiesTest).with(
    test().name("Obj forIn iteration of don't enum properties test")
);