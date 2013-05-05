//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugflow.Task')
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
var Task =              bugpack.require('bugflow.Task');
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
 * This tests..
 * 1) That the taskMethod is executed within the taskContext
 * 2) That the task args are properly passed to the taskMethod
 * 3) That the Task execute callback is properly fired
 */
var bugflowTaskExecuteTaskTest = {

    async: true,

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.arg1 = "arg1";
        this.arg2 = "arg2";
        this.taskContext = {
            contextCheck: "contextCheck",
            taskMethod: function(flow, arg1, arg2) {
                test.assertEqual(this.contextCheck, _this.taskContext.contextCheck,
                    "Assert taskMethod was executed within the taskContext");
                test.assertEqual(arg1, _this.arg1,
                    "Assert arg1 was 'arg1'");
                test.assertEqual(arg2, _this.arg2,
                    "Assert arg2 was 'arg2'");
                flow.complete();
            }
        };
        this.task = new Task(this.taskContext.taskMethod, this.taskContext);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.task.execute([this.arg1, this.arg2], function() {
            test.assertTrue(true, "Task execute callback was executed");
            test.complete();
        });
    }
};
annotate(bugflowTaskExecuteTaskTest).with(
    test().name("BugFlow task execute test")
);
