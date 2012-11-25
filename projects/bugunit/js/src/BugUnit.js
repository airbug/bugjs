//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('BugUnit')

//@Require('Annotate')
//@Require('Class')
//@Require('Obj')
//@Require('ReportCard')
//@Require('Set')
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

/**
 * @private
 * @type {Set<Test>}
 */
BugUnit.registeredTestSet = new Set();


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {Test} test
 */
BugUnit.registerTest = function(test) {
    if (!BugUnit.registeredTestSet.contains(test)) {
        BugUnit.registeredTestSet.add(test);
    }
};

/**
 * @param {boolean} logResults
 * @return {ReportCard}
 */
BugUnit.runTests = function(logResults) {
    var reportCard = new ReportCard();
    BugUnit.registeredTestSet.forEach(function(test) {
        var testResult = TestRunner.runTest(test, logResults);
        reportCard.addTestResult(testResult);
    });
    return reportCard;
};
