//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('BugUnit')

//@Require('Annotate')
//@Require('Class')
//@Require('List')
//@Require('Obj')
//@Require('ReportCard')
//@Require('Test')
//@Require('TestRunner')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugUnit = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

    }


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

BugUnit.registeredTestList = new List();


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

BugUnit.registerTest = function(testName, testObject) {
    var test = new Test(testName, testObject);
    BugUnit.registeredTestList.add(test);
};

/**
 * @param {boolean} logResults
 * @return {*}
 */
BugUnit.runTests = function(logResults) {
    var reportCard = new ReportCard();
    BugUnit.registeredTestList.forEach(function(test) {
        var testResult = TestRunner.runTest(test, logResults);
        reportCard.addTestResult(testResult);
    });
    return reportCard;
};


//-------------------------------------------------------------------------------
// Bootstrap
//-------------------------------------------------------------------------------

Annotate.registerAnnotationProcessor('Test', function(annotation) {
    BugUnit.registerTest(annotation.getParamList().getAt(0), annotation.getReference());
});
