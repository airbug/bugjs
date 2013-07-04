//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Lock')
//@Require('annotate.Annotate')
//@Require('bugdouble.BugDouble')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Lock            = bugpack.require('Lock');
var Annotate        = bugpack.require('annotate.Annotate');
var BugDouble       = bugpack.require('bugdouble.BugDouble');
var TestAnnotation  = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate            = Annotate.annotate;
var test                = TestAnnotation.test;
var spyOnFunction       = BugDouble.spyOnFunction;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 * This tests
 * 1) Instantiation of a Lock
 * 2) acquiring the lock
 * 3) Ensuring that the lock does not execute other acquiring methods when it is locked
 */
var lockTest = {

    async: true,

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testLock = new Lock();
        this.testMethod1 = function() {
            setTimeout(function() {
                test.assertTrue(_this.testMethod2Spy.wasNotCalled(),
                    "Assert method 2 has not been called");
                test.assertTrue(_this.testMethod3Spy.wasNotCalled(),
                    "Assert method 3 has not been called");
                _this.testLock.unlock();
            }, 0);
        };
        this.testMethod1Spy = spyOnFunction(this.testMethod1);
        this.testMethod2 = function() {
            setTimeout(function() {
                test.assertTrue(_this.testMethod1Spy.wasCalled(),
                    "Assert method 1 has been called");
                test.assertTrue(_this.testMethod3Spy.wasNotCalled(),
                    "Assert method 3 has not been called");
                _this.testLock.unlock();
            }, 0);
        };
        this.testMethod2Spy = spyOnFunction(this.testMethod2);
        this.testMethod3 = function() {
            setTimeout(function() {
                test.assertTrue(_this.testMethod1Spy.wasCalled(),
                    "Assert method 1 has not been called");
                test.assertTrue(_this.testMethod2Spy.wasCalled(),
                    "Assert method 2 has not been called");
                _this.testLock.unlock();
                test.complete();
            }, 0);
        };
        this.testMethod3Spy = spyOnFunction(this.testMethod3);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testLock.tryLock(this.testMethod1);
        this.testLock.tryLock(this.testMethod2);
        this.testLock.tryLock(this.testMethod3);
    }
};
annotate(lockTest).with(
    test().name("Lock test")
);

//TODO BRN: Write a stack overflow test
