//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Obj')
//@Require('Queue')
//@Require('annotate.Annotate')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Obj =               bugpack.require('Obj');
var Queue =             bugpack.require('Queue');
var Annotate =          bugpack.require('annotate.Annotate');
var TestAnnotation =    bugpack.require('bugunit-annotate.TestAnnotation');


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
 * 1) queueing a few items and then making sure that they dequeue in the correct order
 */
var enqueueDequeueTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.queue = new Queue();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.queue.enqueue("value1");
        this.queue.enqueue("value2");
        this.queue.enqueue("value3");

        var dequeue1 = this.queue.dequeue();
        var dequeue2 = this.queue.dequeue();
        var dequeue3 = this.queue.dequeue();

        test.assertEqual(dequeue1, "value1",
            "Assert the first value dequeued from the queue is 'value1'");
        test.assertEqual(dequeue2, "value2",
            "Assert the second value dequeued from the queue is 'value2'");
        test.assertEqual(dequeue3, "value3",
            "Assert the third value dequeued from the queue is 'value3'");
    }
};
annotate(enqueueDequeueTest).with(
    test().name("Queue enqueue and dequeue test")
);
