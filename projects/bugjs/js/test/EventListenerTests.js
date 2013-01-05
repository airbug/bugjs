//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Annotate = require('../../lib/Annotate');
var Class = require('../../lib/Class');
var EventListener = require('../../lib/EventListener');
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
 * 1) Instantiation of a new EventListener
 */
var eventListenerInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testListenerFunction = function(event) {};
        this.testListenerContext = {};
        this.eventListener = new EventListener(this.testListenerFunction, this.testListenerContext);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.eventListener, EventListener),
            "Assert EventListener instance extends EventListener ");
    }
};
annotate(eventListenerInstantiationTest).with(
    test().name("EventListener instantiation test")
);


/**
 * This tests
 * 1) That EventListeners with the same function and context are equal
 * 2) That EventListeners with the same function but different contexts are not equal
 * 3) That EventListeners with different functions but the same context are not equal
 * 4) That EventListeners with different functions and different contexts are not equal
 */
var eventListenerEqualityTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testListenerFunction1 = function(event) {};
        this.testListenerContext1 = {};
        this.testListenerFunction2 = function(event) {};
        this.testListenerContext2 = {};

        this.equalEventListener1 = new EventListener(this.testListenerFunction1, this.testListenerContext1);
        this.equalEventListener2 = new EventListener(this.testListenerFunction1, this.testListenerContext1);

        this.notEqualEventListener1 = new EventListener(this.testListenerFunction1, this.testListenerContext1);
        this.notEqualEventListener2 = new EventListener(this.testListenerFunction1, this.testListenerContext2);
        this.notEqualEventListener3 = new EventListener(this.testListenerFunction2, this.testListenerContext1);
        this.notEqualEventListener4 = new EventListener(this.testListenerFunction2, this.testListenerContext2);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.equalEventListener1, this.equalEventListener2,
            "Assert EventListeners with the same function and context are equal");
        test.assertNotEqual(this.notEqualEventListener1, this.notEqualEventListener2,
            "Assert EventListeners with the same function but different contexts are not equal.");
        test.assertNotEqual(this.notEqualEventListener1, this.notEqualEventListener3,
            "Assert EventListeners with different functions but the same context are not equal.");
        test.assertNotEqual(this.notEqualEventListener1, this.notEqualEventListener4,
            "Assert EventListeners with different functions and different contexts are not equal.");
    }
};
annotate(eventListenerEqualityTest).with(
    test().name("EventListener equality test")
);


/**
 * This tests
 * 1) That EventListeners with the same function and context have the same hash code
 */
var eventListenerHashCodeEqualityTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testListenerFunction = function(event) {};
        this.testListenerContext = {};
        this.eventListener1 = new EventListener(this.testListenerFunction, this.testListenerContext);
        this.eventListener2 = new EventListener(this.testListenerFunction, this.testListenerContext);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.eventListener1.hashCode(), this.eventListener2.hashCode(),
            "Assert EventListeners with the same function and context have equal hash codes");
    }
};
annotate(eventListenerHashCodeEqualityTest).with(
    test().name("EventListener hash code equality test")
);


//TODO BRN: Add a hearEvent test