//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Annotate = require('../../lib/Annotate');
var HashUtil = require('../../lib/HashUtil');
var TestAnnotation = require('../../lib/unit/TestAnnotation');
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
var hashRepeatTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.typeValueSets = TypeValueSetsHelper.getTypeValueSets();
        this.hashValues = {};
        for (var type in this.typeValueSets) {
            var typeValueSet = this.typeValueSets[type];
            typeValueSet.forEach(function(typeValue) {
                var hash = HashUtil.hash(typeValue.value);
                _this.hashValues[typeValue.name] = hash;
            });
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {

        // TEST: Repeat the hashing and ensure that the hash values are the same.

        for (var type in this.typeValueSets) {
            var typeValueSet = this.typeValueSets[type];
            var _this = this;
            typeValueSet.forEach(function(typeValue) {
                var repeatHash = HashUtil.hash(typeValue.value);
                var expectedHash = _this.hashValues[typeValue.name];
                test.assertEqual(repeatHash, expectedHash, "Assert hash of " + typeValue.name + " " + typeValue.value +
                    " is the same when it is hashed repeatedly.");
            });
        }
    }
};
annotate(hashRepeatTest).with(
    test().name("Hash repeat test")
);
