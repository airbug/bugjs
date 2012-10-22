//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ReportCard')

//@Require('Class')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ReportCard = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.testResultList = new List();

        this.failedTestResultList = new List();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    getTestResultList: function() {
        return this.testResultList;
    },

    getFailedTestResultList: function() {
        return this.failedTestResultList;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    addTestResult: function(testResult) {
        this.testResultList.add(testResult);
        if (testResult.didTestFail()) {
            this.failedTestResultList.add(testResult);
        }
    },

    numberFailedTests: function() {
        return this.failedTestResultList.getCount();
    },

    numberPassedTests: function() {
        return (this.testResultList.getCount() - this.failedTestResultList.getCount());
    }
});
