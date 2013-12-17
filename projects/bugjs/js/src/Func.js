//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Func')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 */
var Func = Class.extend(Obj, {});


//-------------------------------------------------------------------------------
// Static Public Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {function(...):*} func
 * @param {Object} context
 * @return {function(...):*}
 */
Func.bind = function(func, context) {
    return function() {
        return func.apply(context, arguments);
    };
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Func', Func);
