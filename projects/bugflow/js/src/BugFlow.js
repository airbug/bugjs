//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('BugFlow')

//@Require('Task')

var bugpack = require('bugpack');

var AsyncTask = bugpack.require('AsyncTask');
var Task = bugpack.require('Task');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugFlow = {};


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {function()} taskMethod
 * @param {function()} callback
 * @return {AsyncTask}
 */
BugFlow.asyncTask = function(taskMethod, callback) {
    return new AsyncTask(taskMethod, callback);
};

/**
 * @param {Array<(function()|Task)>} tasksArray
 */
BugFlow.series = function(tasksArray) {

};

/**
 * @param {function()} taskMethod
 * @return {Task}
 */
BugFlow.task = function(taskMethod) {
    return new Task(taskMethod);
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(BugFlow);
