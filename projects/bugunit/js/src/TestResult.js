//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('TestResult')

//@Require('Class')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var TestResult = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(test) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.assertionResultList = new List();

        this.error = null;

        this.failedAssertionResultList = new List();

        this.test = test;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    errorOccurred: function() {
        return this.error !== null;
    },

    getError: function() {
        return this.error;
    },

    setError: function(error) {
        this.error = error;
    },

    getTest: function() {
        return this.test;
    },

    getFailedAssertionResultList: function() {
        return this.failedAssertionResultList;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    addAssertionResult: function(assertionResult) {
        this.assertionResultList.add(assertionResult);
        if (assertionResult.didAssertionFail()) {
            this.failedAssertionResultList.add(assertionResult);
        }
    },

    didTestFail: function() {
        return !this.didTestPass();
    },

    didTestPass: function() {
        return (this.numberFailedAssertions() === 0 && !this.errorOccurred());
    },

    numberAssertions: function() {
        return this.assertionResultList.getCount();
    },

    numberFailedAssertions: function() {
        return this.failedAssertionResultList.getCount();
    },

    numberPassedAssertions: function() {
        return (this.assertionResultList.getCount() - this.failedAssertionResultList.getCount());
    }
});
