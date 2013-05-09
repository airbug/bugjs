//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugflow')

//@Export('BugFlow')

//@Require('bugflow.ForEachParallel')
//@Require('bugflow.ForEachSeries')
//@Require('bugflow.ForInParallel')
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


var ForEachParallel =   bugpack.require('bugflow.ForEachParallel');
var ForEachSeries =     bugpack.require('bugflow.ForEachSeries');
var ForInParallel =     bugpack.require('bugflow.ForInParallel');
var If =                bugpack.require('bugflow.If');
var Parallel =          bugpack.require('bugflow.Parallel');
var Series =            bugpack.require('bugflow.Series');
var Task =              bugpack.require('bugflow.Task');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugFlow = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {Array<*>} data
 * @param {function(Flow, *)} iteratorMethod
 * @return {ForEachParallel}
 */
 // NOTE: SUNG I believe this should be deprecated
BugFlow.$foreachParallel = function(data, iteratorMethod) {
    return new ForEachParallel(data, iteratorMethod);
};

/**
 * @static
 * @param {Array<*>} data
 * @param {function(Flow, *)} iteratorMethod
 * @return {ForEachSeries}
 */
 // NOTE: SUNG I believe this should be deprecated
BugFlow.$foreachSeries = function(data, iteratorMethod) {
    return new ForEachSeries(data, iteratorMethod);
};

/**
 * @static
 * @param {Array<*>} data
 * @param {function(Flow, *)} iteratorMethod
 * @return {ForEachParallel}
 */
BugFlow.$forEachParallel = function(data, iteratorMethod) {
    return new ForEachParallel(data, iteratorMethod);
};

/**
 * @static
 * @param {Array<*>} data
 * @param {function(Flow, *)} iteratorMethod
 * @return {ForEachSeries}
 */
BugFlow.$forEachSeries = function(data, iteratorMethod) {
    return new ForEachSeries(data, iteratorMethod);
};

/**
 * @static
 * @param {Object} data
 * @param {function(Flow, *, *)} iteratorMethod
 * @return {ForInParallel}
 */
BugFlow.$forInParallel = function(data, iteratorMethod) {
    return new ForInParallel(data, iteratorMethod);
};

/**
 * @static
 * @param {function()} ifMethod
 * @param {Task} task
 * @return {*}
 */
BugFlow.$if = function(ifMethod, task) {
    return new If(ifMethod, task);
};

/**
 * @static
 * @param {Array<(Task)>} tasksArray
 * @return {Parallel}
 */
BugFlow.$parallel = function(tasksArray) {
    return new Parallel(tasksArray);
};

/**
 * @static
 * @param {Array<(Task)>} tasksArray
 * @return {Series}
 */
BugFlow.$series = function(tasksArray) {
    return new Series(tasksArray);
};

/**
 * @static
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
