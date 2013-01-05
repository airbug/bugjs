//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Annotate = require('../../lib/Annotate');
var Class = require('../../lib/Class');
var Collection = require('../../lib/Collection');
var Obj = require('../../lib/Obj');
var TestAnnotation = require('../../lib/unit/TestAnnotation');


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
var collectionAddTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.collection = new Collection();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.collection.add('value1');
        test.assertEqual(this.collection.getCount(), 1, "Assert count value is incremented after adding an item to the " +
            "collection");
        test.assertEqual(this.collection.contains('value1'), true, "Assert contains function indicates that the collection " +
            "contains the added value.");
    
        this.collection.add('value2');
        test.assertEqual(this.collection.getCount(), 2, "Assert count value is incremented after adding second item to the " +
            "collection");
        test.assertEqual(this.collection.contains('value1'), true, "Assert contains function indicates that the collection " +
            "contains the first added value.");
        test.assertEqual(this.collection.contains('value2'), true, "Assert contains function indicates that the collection " +
            "contains the second added value.");


        this.collection.add('value3');
        test.assertEqual(this.collection.getCount(), 3, "Assert count value is incremented after adding third item to the " +
            "collection");
        test.assertEqual(this.collection.contains('value1'), true, "Assert contains function indicates that the collection " +
            "contains the first added value.");
        test.assertEqual(this.collection.contains('value2'), true, "Assert contains function indicates that the collection " +
            "contains the second added value.");
        test.assertEqual(this.collection.contains('value3'), true, "Assert contains function indicates that the collection " +
            "contains the third added value.");
    }
};
annotate(collectionAddTest).with(
    test().name("Collection add test")
);


/**
 *
 */
var collectionGetValueArrayTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.collection = new Collection();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.collection.add('value1');
        this.collection.add('value2');
        this.collection.add('value3');
    
        var valuesArray = this.collection.getValueArray();
    
        test.assertEqual(valuesArray[0], 'value1', "Assert array[0] from getValueArray call is value1");
        test.assertEqual(valuesArray[1], 'value2', "Assert value[1] from getValueArray call is value2");
        test.assertEqual(valuesArray[2], 'value3', "Assert value[2] from getValueArray call is value3");
    }
};
annotate(collectionGetValueArrayTest).with(
    test().name("Collection getValueArray test")
);


/**
 *
 */
var collectionAddEqualObjectsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _context = this;
        this.NewClass = Class.extend(Obj, {
            equals: function(value) {
                if (Class.doesExtend(value, _context.NewClass)) {
    
                    //NOTE BRN: This should always return true for instances of this class
    
                    return (this.getValue() === value.getValue());
                }
                return false;
            },
            getValue: function() {
                return 123;
            },
    
            // NOTE BRN: The rules of equality require that equal objects return equal hash codes
    
            hashCode: function() {
                return 123;
            }
        });
        this.instance1 = new this.NewClass();
        this.instance2  = new this.NewClass();
        this.collection = new Collection();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------
    
    test: function(test) {
        this.collection.add(this.instance1);
        test.assertEqual(this.collection.contains(this.instance1), true,
            "Assert that collection contains instance1");
        test.assertEqual(this.collection.contains(this.instance2), true,
            "Assert collection contains instance2 since instance1 and instance2 are equal");
        test.assertEqual(this.collection.getCount(), 1,
            "Assert collection count is 1 after adding instance1");
    
        this.collection.add(this.instance2);
        test.assertEqual(this.collection.contains(this.instance1), true,
            "Assert that collection contains instance1 after adding instance2");
        test.assertEqual(this.collection.contains(this.instance2), true,
            "Assert that collection contains instance2 after adding instance2");
        test.assertEqual(this.collection.getCount(), 2,
            "Assert collection count is 2 after adding instance2");
    }
};
annotate(collectionAddEqualObjectsTest).with(
    test().name("Collection add equal objects test")
);


/**
 *
 */
var collectionAddNonEqualObjectsWithSameHashCodesTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _context = this;
        this.valueCount = 123;
        this.NewClass = Class.extend(Obj, {
            _constructor: function() {
                this.valueCount = _context.valueCount++;
            },
            equals: function(value) {
                if (Class.doesExtend(value, _context.NewClass)) {
    
                    //NOTE BRN: This should always return false for instances of this class
    
                    return (this.getValue() === value.getValue());
                }
            },
            getValue: function() {
                return this.valueCount;
            },
            hashCode: function() {
                return 123;
            }
        });
        this.instance1 = new this.NewClass();
        this.instance2  = new this.NewClass();
        this.collection = new Collection();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.collection.add(this.instance1);
        test.assertEqual(this.collection.contains(this.instance1), true,
            "Assert sanity check that collection contains instance1");
        test.assertEqual(this.collection.contains(this.instance2), false,
            "Assert collection does not contain instance2 since instance1 and instance2 are not equal");
    }
};
annotate(collectionAddNonEqualObjectsWithSameHashCodesTest).with(
    test().name("Collection add non equal objects that have the same hashCodes test")
);

/**
 *
 */
var collectionAddAndRemoveDifferentValuesTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.collection = new Collection();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.collection.add("value1");
        this.collection.add("value2");
        this.collection.add("value3");
        test.assertEqual(this.collection.contains("value1"), true,
            "Assert collection contains value1");
        test.assertEqual(this.collection.contains("value2"), true,
            "Assert collection contains value2");
        test.assertEqual(this.collection.contains("value3"), true,
            "Assert collection contains value3");
        test.assertEqual(this.collection.getCount(), 3,
            "Assert collection count is 3 after adding 3 values");
    
        var removeValue2Result1 = this.collection.remove("value2");
        test.assertEqual(this.collection.contains("value2"), false,
            "Assert collection no longer contains value2 after removing value2");
        test.assertEqual(this.collection.getCount(), 2,
            "Assert collection count is 2 after removing value2");
        test.assertEqual(removeValue2Result1, true,
            "Assert return value from remove() call was true");
    
        var removeValue2Result2 = this.collection.remove("value2");
        test.assertEqual(this.collection.getCount(), 2,
            "Assert collection count is still 2 after removing value2 twice");
        test.assertEqual(removeValue2Result2, false,
            "Assert return value from second remove() call was false");
    
    
        var removeValue1Result1 = this.collection.remove("value1");
        test.assertEqual(this.collection.contains("value1"), false,
            "Assert collection no longer contains value1 after removing value1");
        test.assertEqual(this.collection.getCount(), 1,
            "Assert collection count is 1 after removing value1");
        test.assertEqual(removeValue1Result1, true,
            "Assert return value from remove() call was true");
    
        var removeValue1Result2 = this.collection.remove("value1");
        test.assertEqual(this.collection.getCount(), 1,
            "Assert collection count is still 1 after removing value1 twice");
        test.assertEqual(removeValue1Result2, false,
            "Assert return value from second remove() call was false");
    
        var removeValue3Result1 = this.collection.remove("value3");
        test.assertEqual(this.collection.contains("value3"), false,
            "Assert collection no longer contains value3 after removing value3");
        test.assertEqual(this.collection.getCount(), 0,
            "Assert collection count is 0 after removing value3");
        test.assertEqual(removeValue3Result1, true,
            "Assert return value from remove() call was true");
    
        var removeValue3Result2 = this.collection.remove("value1");
        test.assertEqual(this.collection.getCount(), 0,
            "Assert collection count is still 0 after removing value1 twice");
        test.assertEqual(removeValue3Result2, false,
            "Assert return value from second remove() call was false");
    }
};
annotate(collectionAddAndRemoveDifferentValuesTest).with(
    test().name("Collection add and remove different values test")
);


/**
 *
 */
var collectionAddAndRemoveSameValuesTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.collection = new Collection();
    },


    // Run Test
    //-------------------------------------------------------------------------------
    
    test: function(test) {
        this.collection.add("value1");
        this.collection.add("value1");
        this.collection.add("value1");
        test.assertEqual(this.collection.contains("value1"), true,
            "Assert collection contains value1");
        test.assertEqual(this.collection.getCount(), 3,
            "Assert collection count is 3 after adding three value1s");
    
        var removeResult1 = this.collection.remove("value1");
        test.assertEqual(this.collection.contains("value1"), true,
            "Assert collection still contains value1 after removing one of the value1s");
        test.assertEqual(this.collection.getCount(), 2,
            "Assert collection count is 2 after removing one value1");
        test.assertEqual(removeResult1, true,
            "Assert return value from remove() call was true");
    
        var removeResult2 = this.collection.remove("value1");
        test.assertEqual(this.collection.contains("value1"), true,
            "Assert collection still contains value1 after removing two of the value1s");
        test.assertEqual(this.collection.getCount(), 1,
            "Assert collection count is 1 after removing two value1s");
        test.assertEqual(removeResult2, true,
            "Assert return value from remove() call was true");
    
        var removeResult3 = this.collection.remove("value1");
        test.assertEqual(this.collection.contains("value1"), false,
            "Assert collection no longer contains value1 after removing all of the value1s");
        test.assertEqual(this.collection.getCount(), 0,
            "Assert collection count is 0 after removing all of the value1");
        test.assertEqual(removeResult3, true,
            "Assert return value from remove() call was true");
    
        var removeResult4 = this.collection.remove("value1");
        test.assertEqual(this.collection.getCount(), 0,
            "Assert collection count is still 0 after calling remove(value1) after all value1s have been removed");
        test.assertEqual(removeResult4, false,
            "Assert return value from second remove() call was false");
    }
};
annotate(collectionAddAndRemoveSameValuesTest).with(
    test().name("Collection add and remove same values test")
);
