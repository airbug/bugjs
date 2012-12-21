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

var If = bugpack.require('If');
var Parallel = bugpack.require('Parallel');
var Series = bugpack.require('Series');
var Task = bugpack.require('Task');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugFlow = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

BugFlow.$if = function(ifMethod, task) {
    return new If(ifMethod, task);
};

/**
 * @param {Array<(Task)>} tasksArray
 * @return {Parallel}
 */
BugFlow.$parallel = function(tasksArray) {
    return new Parallel(tasksArray);
};

/**
 * @param {Array<(Task)>} tasksArray
 * @return {Series}
 */
BugFlow.$series = function(tasksArray) {
    return new Series(tasksArray);
};

/**
 * @param {function()} taskMethod
 * @return {Task}
 */
BugFlow.$task = function(taskMethod) {
    return new Task(taskMethod);
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(BugFlow);
