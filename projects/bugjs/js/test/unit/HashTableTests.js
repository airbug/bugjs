//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/Annotate').annotate;
var HashTable = require('../../lib/HashTable');
var TypeUtil = require('../../lib/TypeUtil');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var HashTableTests = {

    /**
     * This tests
     * 1) Instantiation of a new HashTable
     * 2) That the count of a HashTable is 0 after instantiation
     */
    hashTableInstantiationTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var hashTable = new HashTable();


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertEqual(hashTable.getCount(), 0,
            "Assert HashTable count is 0 after instantiation");

    }).with('@Test("HashTable - instantiation test")'),

    /**
     * This tests
     * 1) That the getKeyArray method returns an array of the HashTable's keys
     */
    hashTableGetKeyArrayTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var hashTable = new HashTable();
        hashTable.put('key1', 'value1');
        hashTable.put('key2', 'value2');
        hashTable.put('key3', 'value3');
        var keyArray = hashTable.getKeyArray();


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertTrue(TypeUtil.isArray(keyArray),
            "Assert value returned from getKeyArray is an array");
        this.assertEqual(keyArray.length, 3,
            "Assert key array length is 3");
        this.assertTrue((keyArray.indexOf('key1') >= 0),
            "Assert key1 is in the key array");
        this.assertTrue((keyArray.indexOf('key2') >= 0),
            "Assert key2 is in the key array");
        this.assertTrue((keyArray.indexOf('key3') >= 0),
            "Assert key3 is in the key array");

    }).with('@Test("HashTableNode - getKeyArray test")'),

    /**
     * This tests
     * 1) That the getValueArray method returns an array of the HashTable's values
     */
    hashTableGetValueArrayTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var hashTable = new HashTable();
        hashTable.put('key1', 'value1');
        hashTable.put('key2', 'value2');
        hashTable.put('key3', 'value3');
        var valueArray = hashTable.getValueArray();


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertTrue(TypeUtil.isArray(valueArray),
            "Assert value returned from getValueArray is an array");
        this.assertEqual(valueArray.length, 3,
            "Assert value array length is 3");
        this.assertTrue((valueArray.indexOf('value1') >= 0),
            "Assert value1 is in the value array");
        this.assertTrue((valueArray.indexOf('value2') >= 0),
            "Assert value2 is in the value array");
        this.assertTrue((valueArray.indexOf('value3') >= 0),
            "Assert value3 is in the value array");

    }).with('@Test("HashTableNode - getValueArray test")')
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = HashTableTests;
