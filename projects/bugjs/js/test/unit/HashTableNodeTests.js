//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/Annotate').annotate;
var HashTableNode = require('../../lib/HashTableNode');
var TypeUtil = require('../../lib/TypeUtil');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var HashTableNodeTests = {

    /**
     * This tests
     * 1) Instantiation of a new HashTableNode
     * 2) That the count of a HashTableNode is 0 after instantiation
     */
    hashTableNodeInstantiationTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var hashTableNode = new HashTableNode();


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertEqual(hashTableNode.getCount(), 0,
            "Assert HashTableNode count is 0 after instantiation");

    }).with('@Test("HashTableNode - instantiation test")'),

    /**
     * This tests
     * 1) That the getKeyArray method returns an array of the HashTableNode's keys
     */
    hashTableNodeGetKeyArrayTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var hashTableNode = new HashTableNode();
        hashTableNode.put('key1', 'value1');
        hashTableNode.put('key2', 'value2');
        hashTableNode.put('key3', 'value3');
        var keyArray = hashTableNode.getKeyArray();


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

    }).with('@Test("HashTableNode - getKeyArray test")')
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = HashTableNodeTests;
