//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('BugBoil')

//@Require('Parallel')
//@Require('Series')
//@Require('Task')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ForEachParallel = bugpack.require('ForEachParallel');
var ForEachSeries = bugpack.require('ForEachSeries');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugBoil = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {Array<*>} data
 * @param {function(Boil, *)} iteratorMethod
 * @return {ForEachParallel}
 */
BugBoil.$foreachParallel = function(data, iteratorMethod) {
    return new ForEachParallel(data, iteratorMethod);
};

/**
 * @param {Array<*>} data
 * @param {function(Boil, *)} iteratorMethod
 * @return {ForEachSeries}
 */
BugBoil.$foreachSeries = function(data, iteratorMethod) {
    return new ForEachSeries(data, iteratorMethod);
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(BugBoil);
