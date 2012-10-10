//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/Annotate').annotate;
var HashTableEntry = require('../../lib/HashTableEntry');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var HashTableEntryTests = {

    /**
     * This tests
     * 1) Instantiation of a new HashTableEntry
     * 2) That the "key" property was set correctly during instantiation
     * 3) That the "value" property was set correctly during instantiation
     */
    hashTableEntryInstantiationTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var testKey = "testKey";
        var testValue = "testValue";
        var hashTableEntry = new HashTableEntry(testKey, testValue);


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertEqual(hashTableEntry.getKey(), testKey,
            "Assert key property was set correctly during instantiation");
        this.assertEqual(hashTableEntry.getValue(), testValue,
            "Assert value property was set correctly during instantiation");

    }).with('@Test("HashTableEntry - instantiation test")')
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = HashTableEntryTests;
