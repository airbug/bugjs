//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/Annotate').annotate;
var Class = require('../../lib/Class');
var Collection = require('../../lib/Collection');
var Obj = require('../../lib/Obj');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var CollectionTests = {
    /**
     *
     */
    collectionAddTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var collection = new Collection();


        // Run Test
        //-------------------------------------------------------------------------------

        collection.add('value1');
        this.assertEqual(collection.getCount(), 1, "Assert count value is incremented after adding an item to the " +
            "collection");
        this.assertEqual(collection.contains('value1'), true, "Assert contains function indicates that the collection " +
            "contains the added value.");

        collection.add('value2');
        this.assertEqual(collection.getCount(), 2, "Assert count value is incremented after adding second item to the " +
            "collection");
        this.assertEqual(collection.contains('value1'), true, "Assert contains function indicates that the collection " +
            "contains the first added value.");
        this.assertEqual(collection.contains('value2'), true, "Assert contains function indicates that the collection " +
            "contains the second added value.");


        collection.add('value3');
        this.assertEqual(collection.getCount(), 3, "Assert count value is incremented after adding third item to the " +
            "collection");
        this.assertEqual(collection.contains('value1'), true, "Assert contains function indicates that the collection " +
            "contains the first added value.");
        this.assertEqual(collection.contains('value2'), true, "Assert contains function indicates that the collection " +
            "contains the second added value.");
        this.assertEqual(collection.contains('value3'), true, "Assert contains function indicates that the collection " +
            "contains the third added value.");

    }).with('@Test("Collection add test")'),

    /**
     *
     */
    collectionGetValueArrayTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var collection = new Collection();


        // Run Test
        //-------------------------------------------------------------------------------

        collection.add('value1');
        collection.add('value2');
        collection.add('value3');

        var valuesArray = collection.getValueArray();

        this.assertEqual(valuesArray[0], 'value1', "Assert array[0] from getValueArray call is value1");
        this.assertEqual(valuesArray[1], 'value2', "Assert value[1] from getValueArray call is value2");
        this.assertEqual(valuesArray[2], 'value3', "Assert value[2] from getValueArray call is value3");

    }).with('@Test("Collection getValueArray test")'),

    /**
     *
     */
    collectionAddEqualObjectsTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var NewClass = Class.extend(Obj, {
            equals: function(value) {
                if (Class.doesExtend(value, NewClass)) {

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
        var instance1 = new NewClass();
        var instance2  = new NewClass();
        var collection = new Collection();


        // Run Test
        //-------------------------------------------------------------------------------

        collection.add(instance1);
        this.assertEqual(collection.contains(instance1), true,
            "Assert that collection contains instance1");
        this.assertEqual(collection.contains(instance2), true,
            "Assert collection contains instance2 since instance1 and instance2 are equal");
        this.assertEqual(collection.getCount(), 1,
            "Assert collection count is 1 after adding instance1");

        collection.add(instance2);
        this.assertEqual(collection.contains(instance1), true,
            "Assert that collection contains instance1 after adding instance2");
        this.assertEqual(collection.contains(instance2), true,
            "Assert that collection contains instance2 after adding instance2");
        this.assertEqual(collection.getCount(), 2,
            "Assert collection count is 2 after adding instance2");


    }).with('@Test("Collection add equal objects test")'),

    /**
     *
     */
    collectionAddNonEqualObjectsWithSameHashCodesTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var valueCount = 123;
        var NewClass = Class.extend(Obj, {
            _constructor: function() {
                this.valueCount = valueCount++;
            },
            equals: function(value) {
                if (Class.doesExtend(value, NewClass)) {

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
        var instance1 = new NewClass();
        var instance2  = new NewClass();
        var collection = new Collection();


        // Run Test
        //-------------------------------------------------------------------------------

        collection.add(instance1);
        this.assertEqual(collection.contains(instance1), true,
            "Assert sanity check that collection contains instance1");
        this.assertEqual(collection.contains(instance2), false,
            "Assert collection does not contain instance2 since instance1 and instance2 are not equal");

    }).with('@Test("Collection add non equal objects that have the same hashCodes test")'),

    /**
     *
     */
    collectionAddAndRemoveDifferentValuesTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var collection = new Collection();


        // Run Test
        //-------------------------------------------------------------------------------

        collection.add("value1");
        collection.add("value2");
        collection.add("value3");
        this.assertEqual(collection.contains("value1"), true,
            "Assert collection contains value1");
        this.assertEqual(collection.contains("value2"), true,
            "Assert collection contains value2");
        this.assertEqual(collection.contains("value3"), true,
            "Assert collection contains value3");
        this.assertEqual(collection.getCount(), 3,
            "Assert collection count is 3 after adding 3 values");

        var removeValue2Result1 = collection.remove("value2");
        this.assertEqual(collection.contains("value2"), false,
            "Assert collection no longer contains value2 after removing value2");
        this.assertEqual(collection.getCount(), 2,
            "Assert collection count is 2 after removing value2");
        this.assertEqual(removeValue2Result1, true,
            "Assert return value from remove() call was true");

        var removeValue2Result2 = collection.remove("value2");
        this.assertEqual(collection.getCount(), 2,
            "Assert collection count is still 2 after removing value2 twice");
        this.assertEqual(removeValue2Result2, false,
            "Assert return value from second remove() call was false");


        var removeValue1Result1 = collection.remove("value1");
        this.assertEqual(collection.contains("value1"), false,
            "Assert collection no longer contains value1 after removing value1");
        this.assertEqual(collection.getCount(), 1,
            "Assert collection count is 1 after removing value1");
        this.assertEqual(removeValue1Result1, true,
            "Assert return value from remove() call was true");

        var removeValue1Result2 = collection.remove("value1");
        this.assertEqual(collection.getCount(), 1,
            "Assert collection count is still 1 after removing value1 twice");
        this.assertEqual(removeValue1Result2, false,
            "Assert return value from second remove() call was false");

        var removeValue3Result1 = collection.remove("value3");
        this.assertEqual(collection.contains("value3"), false,
            "Assert collection no longer contains value3 after removing value3");
        this.assertEqual(collection.getCount(), 0,
            "Assert collection count is 0 after removing value3");
        this.assertEqual(removeValue3Result1, true,
            "Assert return value from remove() call was true");

        var removeValue3Result2 = collection.remove("value1");
        this.assertEqual(collection.getCount(), 0,
            "Assert collection count is still 0 after removing value1 twice");
        this.assertEqual(removeValue3Result2, false,
            "Assert return value from second remove() call was false");

    }).with('@Test("Collection add and remove different values test")'),

    /**
     *
     */
    collectionAddAndRemoveSameValuesTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var collection = new Collection();


        // Run Test
        //-------------------------------------------------------------------------------

        collection.add("value1");
        collection.add("value1");
        collection.add("value1");
        this.assertEqual(collection.contains("value1"), true,
            "Assert collection contains value1");
        this.assertEqual(collection.getCount(), 3,
            "Assert collection count is 3 after adding three value1s");

        var removeResult1 = collection.remove("value1");
        this.assertEqual(collection.contains("value1"), true,
            "Assert collection still contains value1 after removing one of the value1s");
        this.assertEqual(collection.getCount(), 2,
            "Assert collection count is 2 after removing one value1");
        this.assertEqual(removeResult1, true,
            "Assert return value from remove() call was true");

        var removeResult2 = collection.remove("value1");
        this.assertEqual(collection.contains("value1"), true,
            "Assert collection still contains value1 after removing two of the value1s");
        this.assertEqual(collection.getCount(), 1,
            "Assert collection count is 1 after removing two value1s");
        this.assertEqual(removeResult2, true,
            "Assert return value from remove() call was true");

        var removeResult3 = collection.remove("value1");
        this.assertEqual(collection.contains("value1"), false,
            "Assert collection no longer contains value1 after removing all of the value1s");
        this.assertEqual(collection.getCount(), 0,
            "Assert collection count is 0 after removing all of the value1");
        this.assertEqual(removeResult3, true,
            "Assert return value from remove() call was true");

        var removeResult4 = collection.remove("value1");
        this.assertEqual(collection.getCount(), 0,
            "Assert collection count is still 0 after calling remove(value1) after all value1s have been removed");
        this.assertEqual(removeResult4, false,
            "Assert return value from second remove() call was false");


    }).with('@Test("Collection add and remove same values test")')
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = CollectionTests;
