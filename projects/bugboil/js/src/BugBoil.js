//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugboil')

//@Export('BugBoil')

//@Require('bugboil.ForEachParallel')
//@Require('bugboil.ForEachSeries')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ForEachParallel =   bugpack.require('bugboil.ForEachParallel');
var ForEachSeries =     bugpack.require('bugboil.ForEachSeries');


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

bugpack.export('bugboil.BugBoil', BugBoil);
