//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Annotate = require('../../lib/Annotate');
var Class = require('../../lib/Class');
var Collection = require('../../lib/Collection');
var Map = require('../../lib/Map');
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
var mapSimplePutContainsValueTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.map = new Map();
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
        this.map.put('key1', this.value1);
        this.map.put('key2', this.value2);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.map.containsValue(this.value1), true,
            "Assert containsValue returns true for value1.");
        test.assertEqual(this.map.containsValue(this.value2), true,
            "Assert containsValue returns true for value2.");
        test.assertEqual(this.map.containsValue(this.value3), false,
            "Assert containsValue returns false for value that hasn't been added to the map.");
    }
};
annotate(mapSimplePutContainsValueTest).with(
    test().name("Map - simple put/containsValue test")
);


/**
 *
 */
var mapSimplePutGetTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.map = new Map();
        this.key1 = "key1";
        this.value1 = "value1";
        this.map.put(this.key1, this.value1);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.map.get(this.key1), this.value1,
            "Assert value mapped to key is correct.");
    }
};
annotate(mapSimplePutGetTest).with(
    test().name("Map - simple put/get test")
);


/**
 * This tests..
 * 1) That the getKeyCollection method successfully returns a Collection
 * 2) That the getKeyCollection method of an empty Map returns an empty Collection
 */
var mapGetKeyCollectionOnEmptyMapTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.map = new Map();
        this.emptyKeyCollection = this.map.getKeyCollection();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.emptyKeyCollection, Collection),
            "Assert getKeyCollection returned a Collection when called on an empty Map");
        test.assertEqual(this.emptyKeyCollection.getCount(), 0,
            "Assert key Collection count is 0");
    }
};
annotate(mapGetKeyCollectionOnEmptyMapTest).with(
    test().name("Map - getKeyCollection called on an empty Map test")
);


/**
 * This tests..
 * 1) That the getKeyCollection method successfully returns a Collection
 * 2) That the getKeyCollection method of an empty Map returns a map with all of the Map's keys
 */
var mapGetKeyCollectionTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function()  {
        this.map = new Map();
        this.key1 = "key1";
        this.key2 = "key2";
        this.key3 = "key3";
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
        this.map.put(this.key1, this.value1);
        this.map.put(this.key2, this.value2);
        this.map.put(this.key3, this.value3);
        this.keyCollection = this.map.getKeyCollection();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.keyCollection, Collection),
            "Assert getKeyCollection returned a Collection");
        test.assertEqual(this.keyCollection.getCount(), 3,
            "Assert key Collection count is 3");
        test.assertEqual(this.keyCollection.contains(this.key1), true,
            "Assert key Collection contains key1");
        test.assertEqual(this.keyCollection.contains(this.key2), true,
            "Assert key Collection contains key2");
        test.assertEqual(this.keyCollection.contains(this.key3), true,
            "Assert key Collection contains key3");
    }
};
annotate(mapGetKeyCollectionTest).with(
    test().name("Map - getKeyCollection test")
);


/**
 *
 */
var mapDataTypeKeyTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.keys = [
            {},
            [],
            'key',
            123,
            true
        ];
        this.values = [
            'value1',
            'value2',
            'value3',
            'value4',
            'value5'
        ];
        this.map = new Map();

        for (var i = 0, size = this.keys.length; i < size; i++) {
            var key = this.keys[i];
            var value = this.values[i];
            this.map.put(key, value);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(this.map.containsKey(this.keys[0]),
            "Assert plain javascript object can be used as a key.");
        test.assertTrue(this.map.containsKey(this.keys[1]),
            "Assert plain javascript array can be used as a key.");
        test.assertTrue(this.map.containsKey(this.keys[2]),
            "Assert plain javascript string can be used as a key.");
        test.assertTrue(this.map.containsKey(this.keys[3]),
            "Assert plain javascript number can be used as a key.");
        test.assertTrue(this.map.containsKey(this.keys[4]),
            "Assert plain javascript boolean can be used as a key.");
        test.assertFalse(this.map.containsKey({}),
            "Assert that different plain javascript objects are treated as different keys.");
        test.assertFalse(this.map.containsKey([]),
            "Assert that different plain javascript arrays are treated as different keys.");
    }
};
annotate(mapDataTypeKeyTest).with(
    test().name("Map - data type key test")
);

//TODO BRN: Add a test for native javascript object names such as "constructor" and "hasOwnProperty"
//TODO BRN: Add a remove test

