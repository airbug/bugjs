//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/Annotate').annotate;
var HashUtil = require('../../lib/HashUtil');
var TypeValueSetsHelper = require('../helper/TypeValueSetsHelper');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var HashUtilTests = {

    /**
     *
     */
    hashRepeatTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var typeValueSets = TypeValueSetsHelper.getTypeValueSets();
        var hashValues = {};

        for (var type in typeValueSets) {
            var typeValueSet = typeValueSets[type];
            typeValueSet.forEach(function(typeValue) {
                var hash = HashUtil.hash(typeValue.value);
                hashValues[typeValue.name] = hash;
            });
        }


        // Run Test
        //-------------------------------------------------------------------------------

        // TEST: Repeat the hashing and ensure that the hash values are the same.

        for (var type in typeValueSets) {
            var typeValueSet = typeValueSets[type];
            var _this = this;
            typeValueSet.forEach(function(typeValue) {
                var repeatHash = HashUtil.hash(typeValue.value);
                var expectedHash = hashValues[typeValue.name];
                _this.assertEqual(repeatHash, expectedHash, "Assert hash of " + typeValue.name + " " + typeValue.value +
                    " is the same when it is hashed repeatedly.");
            });
        }

    }).with('@Test("Hash repeat test")')
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = HashUtilTests;
