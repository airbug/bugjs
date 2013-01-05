//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Annotate = require('../../lib/Annotate');
var EventDispatcher = require('../../lib/EventDispatcher');
var Event = require('../../lib/Event');
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
 * 1) Instantiating an EventDispatcher
 * 2) That the dispatcher target is set to itself if no target is passed in during instantiation
 * 3) That the dispatcher target is set to the value passed in during instantiation
 */
var eventDispatcherInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.eventDispatcherWithoutTarget = new EventDispatcher();
        this.testTarget = {};
        this.eventDispatcherWithTarget = new EventDispatcher(this.testTarget);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.eventDispatcherWithoutTarget.getParentDispatcher(), undefined,
            "Assert parent dispatcher defaults to undefined");
        test.assertEqual(this.eventDispatcherWithoutTarget.getTarget(), this.eventDispatcherWithoutTarget,
            "Assert dispatcher target is set to itself if no target is passed in during instantiation");
        test.assertEqual(this.eventDispatcherWithTarget.getTarget(), this.testTarget,
            "Assert dispatcher target is set to the target passed in during instantiation");
    }
};
annotate(eventDispatcherInstantiationTest).with(
    test().name("EventDispatcher instantiation test")
);


/**
 * This tests
 * 1) Adding and event listener
 * 2) Dispatching a simple event
 */
var eventDispatcherSimpleAddEventListenerDispatchEventTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.eventDispatcher = new EventDispatcher();
        this.testEventType = "testEventType";
        this.testEventData = "testEventData";
        this.testEvent = new Event(this.testEventType, this.testEventData);

        this.calledVar = false;
        this.testContextVar = "some value";
        this.testListenerContext = {
            testContextVar: this.testContextVar
        };
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.testListenerFunction = function(event) {
            _this.calledVar = true;
            test.assertEqual(this.testContextVar, _this.testContextVar,
                "Assert the listener function was called in the listener context");
            test.assertEqual(event.getType(), _this.testEventType,
                "Assert event type received was the event type published");
            test.assertEqual(event.getData(), _this.testEventData,
                "Assert event data received was the event data published");
            test.assertEqual(event.getTarget(), _this.eventDispatcher,
                "Assert event target is the dispatcher that dispatched the event");
        };
        this.eventDispatcher.addEventListener(this.testEventType, this.testListenerFunction, this.testListenerContext);
        this.eventDispatcher.dispatchEvent(this.testEvent);
        test.assertTrue(this.calledVar, "Assert listener function was called.");
    }
};
annotate(eventDispatcherSimpleAddEventListenerDispatchEventTest).with(
    test().name("EventDispatcher simple add event listener and dispatch event test")
);


/**
 * This tests
 * 1) Adding an anonymous event listener
 * 2) Dispatching a simple event with anonymous listeners
 */
var eventDispatcherAddAnonymousEventListenerDispatchEventTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.eventDispatcher = new EventDispatcher();
        this.testEventType = "testEventType";
        this.testEventData = "testEventData";
        this.testEvent = new Event(this.testEventType, this.testEventData);
        this.calledVar = false;
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.testListenerFunction = function(event) {
            _this.calledVar = true;
            test.assertEqual(event.getType(), _this.testEventType,
                "Assert event type received was the event type published");
            test.assertEqual(event.getData(), _this.testEventData,
                "Assert event data received was the event data published");
            test.assertEqual(event.getTarget(), _this.eventDispatcher,
                "Assert event target is the dispatcher that dispatched the event");
        };
        this.eventDispatcher.addEventListener(this.testEventType, this.testListenerFunction);
        this.eventDispatcher.dispatchEvent(this.testEvent);
        test.assertTrue(this.calledVar, "Assert listener function was called.");
    }
};
annotate(eventDispatcherAddAnonymousEventListenerDispatchEventTest).with(
    test().name("EventDispatcher add anonymous event listener and dispatch event test")
);


/**
 * This tests
 * 1) That an event does not bubble when bubbles is false on dispatchEvent
 */
var eventDispatcherDispatchEventBubblesFalseTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testChildEventDispatcher = new EventDispatcher();
        this.testParentEventDispatcher = new EventDispatcher();
        this.testEventType = "testEventType";
        this.testEventData = "testEventData";
        this.testEvent = new Event(this.testEventType, this.testEventData);
        this.testBubbles = false;
        this.childCalledVar = false;
        var _this = this;
        this.testChildListenerFunction = function(event) {
            _this.childCalledVar = true;
        };
        this.parentCalledVar = false;
        this.testParentListenerFunction = function(event) {
            _this.parentCalledVar = true;
        };
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testChildEventDispatcher.setParentDispatcher(this.testParentEventDispatcher);
        this.testChildEventDispatcher.addEventListener(this.testEventType, this.testChildListenerFunction);
        this.testParentEventDispatcher.addEventListener(this.testEventType, this.testParentListenerFunction);
        this.testChildEventDispatcher.dispatchEvent(this.testEvent, this.testBubbles);
        test.assertTrue(this.childCalledVar,
            "Assert listener function on child dispatcher was called when bubbles is false.");
        test.assertFalse(this.parentCalledVar,
            "Assert listener function on parent dispatcher was not called when bubbles is false.");
    }
};
annotate(eventDispatcherDispatchEventBubblesFalseTest).with(
    test().name("EventDispatcher dispatch event with bubbles false test")
);


/**
 * This tests
 * 1) That an event does bubble when bubbles is true on dispatchEvent
 */
var eventDispatcherDispatchEventBubblesTrueTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testChildEventDispatcher = new EventDispatcher();
        this.testParentEventDispatcher = new EventDispatcher();
        this.testEventType = "testEventType";
        this.testEventData = "testEventData";
        this.testEvent = new Event(this.testEventType, this.testEventData);
        this.testBubbles = true;
        this.childCalledVar = false;
        this.testChildListenerFunction = function(event) {
            _this.childCalledVar = true;
        };
        this.parentCalledVar = false;
        this.testParentListenerFunction = function(event) {
            _this.parentCalledVar = true;
        };
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testChildEventDispatcher.setParentDispatcher(this.testParentEventDispatcher);
        this.testChildEventDispatcher.addEventListener(this.testEventType, this.testChildListenerFunction);
        this.testParentEventDispatcher.addEventListener(this.testEventType, this.testParentListenerFunction);
        this.testChildEventDispatcher.dispatchEvent(this.testEvent, this.testBubbles);
        test.assertTrue(this.childCalledVar,
            "Assert listener function on child dispatcher was called when bubbles is true.");
        test.assertTrue(this.parentCalledVar,
            "Assert listener function on parent dispatcher was called when bubbles is true.");
    }
};
annotate(eventDispatcherDispatchEventBubblesTrueTest).with(
    test().name("EventDispatcher dispatch event with bubbles true test")
);


/**
 * This tests
 * 1) That an event does not bubble on dispatchEvent when stopPropagation is called
 */
var eventDispatcherDispatchEventStopPropagationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testChildEventDispatcher = new EventDispatcher();
        this.testParentEventDispatcher = new EventDispatcher();
        this.testEventType = "testEventType";
        this.testEventData = "testEventData";
        this.testEvent = new Event(this.testEventType, this.testEventData);
        this.testBubbles = true;
        this.childCalledVar = false;
        this.testChildListenerFunction = function(event) {
            _this.childCalledVar = true;
            event.stopPropagation();
        };
        this.parentCalledVar = false;
        this.testParentListenerFunction = function(event) {
            _this.parentCalledVar = true;
        };
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testChildEventDispatcher.setParentDispatcher(this.testParentEventDispatcher);
        this.testChildEventDispatcher.addEventListener(this.testEventType, this.testChildListenerFunction);
        this.testParentEventDispatcher.addEventListener(this.testEventType, this.testParentListenerFunction);
        this.testChildEventDispatcher.dispatchEvent(this.testEvent, this.testBubbles);
        test.assertTrue(this.childCalledVar,
            "Assert listener function on child dispatcher was called");
        test.assertFalse(this.parentCalledVar,
            "Assert listener function on parent dispatcher was not called when stopPropagation was called on a child " +
                "EventDispatcher");
    }
};
annotate(eventDispatcherDispatchEventStopPropagationTest).with(
    test().name("EventDispatcher dispatch event stopPropagation test")
);


/**
 * This tests
 * 1) Adding an event listener
 * 2) That hasEventListener returns true after adding an event listener
 * 3) Removing the event listener
 * 4) That hasEventListener returns false after removing the event listener
 */
var eventDispatcherSimpleAddAndRemoveEventListenerTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.eventDispatcher = new EventDispatcher();
        this.testEventType = "testEventType";
        this.testListenerContext = {};
        this.testListenerFunction = function(event) {};
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.eventDispatcher.addEventListener(this.testEventType, this.testListenerFunction, this.testListenerContext);
        var hasListenerAfterAdd = this.eventDispatcher.hasEventListener(this.testEventType, this.testListenerFunction,
            this.testListenerContext);
        test.assertTrue(hasListenerAfterAdd,
            "Assert hasEventListener returns true after adding an event listener.");

        this.eventDispatcher.removeEventListener(this.testEventType, this.testListenerFunction,
            this.testListenerContext);
        var hasListenerAfterRemove = this.eventDispatcher.hasEventListener(this.testEventType,
            this.testListenerFunction, this.testListenerContext);
        test.assertFalse(hasListenerAfterRemove,
            "Assert hasEventListener returns false after removing the event listener.");
    }
};
annotate(eventDispatcherSimpleAddAndRemoveEventListenerTest).with(
    test().name("EventDispatcher simple add and remove event listener test")
);
