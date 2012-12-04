//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('BugFlow')

//@Require('Parallel')
//@Require('Series')
//@Require('Task')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('BugFlow');

var Parallel = bugpack.require('Parallel');
var Series = bugpack.require('Series');
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
 * @param {Array<(function()|Task)>} tasksArray
 * @param {function()} callback
 * @return {Parallel}
 */
BugFlow.parallel = function(tasksArray, callback) {
    return new Parallel(tasksArray, callback);
};

/**
 * @param {Array<(function()|Task)>} tasksArray
 * @param {function()} callback
 * @return {Series}
 */
BugFlow.series = function(tasksArray, callback) {
    return new Series(tasksArray, callback);
};

/**
 * @param {function()} taskMethod
 * @param {function()} callback
 * @return {Task}
 */
BugFlow.task = function(taskMethod, callback) {
    return new Task(taskMethod, callback);
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(BugFlow);
