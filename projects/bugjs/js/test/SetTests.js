//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Annotate = require('../../lib/Annotate');
var Class = require('../../lib/Class');
var Obj = require('../../lib/Obj');
var Set = require('../../lib/Set');
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
 * This tests
 * 1) Adding as simple string to a set
 * 2) Adding a second simple string to a set
 */
var setAddTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.set = new Set();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.set.add("value1");
        test.assertTrue(this.set.contains("value1"),
            "Assert first item added to the set is contained within the set.");
        test.assertEqual(this.set.getCount(), 1,
            "Assert count is 1 after adding 1 item.");

        this.set.add("value2");
        test.assertTrue(this.set.contains("value1"),
            "Assert first item added to the list is still contained within the set after adding a second item.");
        test.assertTrue(this.set.contains("value2"),
            "Assert second item added to the set is contained within the set.");
        test.assertEqual(this.set.getCount(), 2,
            "Assert count is 2 after adding 2 items.");
    }
};
annotate(setAddTest).with(
    test().name("Set add test")
);


/**
 *
 */
var setAddRepeatTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.set = new Set();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.set.add("value1");
        test.assertTrue(this.set.contains('value1'),
            "Assert first item added to the set is contained within the set.");
        test.assertEqual(this.set.getCount(), 1,
            "Assert count is 1 after adding 1 item.");

        this.set.add("value1");
        test.assertEqual(this.set.getCount(), 1,
            "Assert count is still 1 after adding the same item a second time.");
        test.assertTrue(this.set.contains("value1"),
            "Assert set still contains the item after adding it twice.");
    }
};
annotate(setAddRepeatTest).with(
    test().name("Set add repeat test")
);


/**
 * This tests...
 * 1) That two different class instances that are equal will be treated as the same value by Set
 * and thus only one of them will be stored.
 * 2) That adding one of the two instances to the Set will cause the Set's contains function to return true for
 * both instances
 */
var setAddEqualObjectsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _context = this;
        this.set = new Set();
        this.NewClass = Class.extend(Obj, {
            equals: function(value) {
                if (Class.doesExtend(value, _context.NewClass)) {
                    return true;
                }
            },
            hashCode: function() {
                return 12345;
            }
        });
        this.instance1 = new this.NewClass();
        this.instance2 = new this.NewClass();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.set.add(this.instance1);
        test.assertTrue(this.set.contains(this.instance1),
            "Assert instance 1 is contained within the set after adding it to the set.");
        test.assertEqual(this.set.getCount(), 1, "Assert count is 1 after adding instance 1.");
        test.assertTrue(this.set.contains(this.instance2),
            "Assert contains returns true for instance 2 even though instance 2 hasn't been added but is equal to instance1.");

        this.set.add(this.instance2);
        test.assertEqual(this.set.getCount(), 1, 'Assert count is still 1 after adding instance 2.');
    }
};
annotate(setAddEqualObjectsTest).with(
    test().name("Set add equal objects test")
);


/**
 *
 */
var setContainsNonEqualObjectsWithSameHashCodesTest = {

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
        this.set = new Set();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.set.add(this.instance1);
        test.assertEqual(this.set.contains(this.instance1), true,
            "Assert sanity check that set contains instance1");
        test.assertEqual(this.set.contains(this.instance2), false,
            "Assert set does not contain instance2 since instance1 and instance2 are not equal");

        this.set.add(this.instance2);
        test.assertEqual(this.set.getCount(), 2,
            "Set count is 2 after adding instance2");
        test.assertEqual(this.set.contains(this.instance1), true,
            "Assert set contains instance1");
        test.assertEqual(this.set.contains(this.instance2), true,
            "Assert set contains instance2");
    }
};
annotate(setContainsNonEqualObjectsWithSameHashCodesTest).with(
    test().name("Set contains non equal objects that have the same hashCodes test")
);
