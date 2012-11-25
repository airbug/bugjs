//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('TestScan')

//@Require('Annotate')
//@Require('BugUnit')
//@Require('Class')
//@Require('Obj')
//@Require('Test')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var TestScan = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    scan: function() {
        var _this = this;
        var testAnnotations = Annotate.getAnnotationsByType("Test");
        if (testAnnotations) {
            testAnnotations.forEach(function(annotation) {
                var testObject = annotation.getReference();
                var testName = annotation.getName();
                var test = new Test(testName, testObject);
                BugUnit.registerTest(test);
            });
        }
    }
});
