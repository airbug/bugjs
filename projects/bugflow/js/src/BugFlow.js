//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugflow')

//@Export('BugFlow')

//@Require('bugflow.If')
//@Require('bugflow.Parallel')
//@Require('bugflow.Series')
//@Require('bugflow.Task')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var If =        bugpack.require('bugflow.If');
var Parallel =  bugpack.require('bugflow.Parallel');
var Series =    bugpack.require('bugflow.Series');
var Task =      bugpack.require('bugflow.Task');


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

bugpack.export('bugflow.BugFlow', BugFlow);
