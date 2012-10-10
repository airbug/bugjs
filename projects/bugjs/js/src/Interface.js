//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@export('Interface')

//@require('TypeUtil')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Interface = function() {};


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {Object} declaration
 * @return {Function}
 */
Interface.declare = function(declaration) {
    var prototype = {};
    for (var name in declaration) {
        if (TypeUtil.isFunction(declaration[name])) {
            prototype[name] = declaration[name];
        } else {
            throw new Error("Interface can only declare functions");
        }
    }
    var newInterface = function() {};
    newInterface.prototype = prototype;
    newInterface.constructor = newInterface;
    return newInterface;
};

Interface.extend = function(_interface, declaration) {
    var prototype = new _interface();
    for (var name in declaration) {
        if (TypeUtil.isFunction(prototype[name])) {
            if (TypeUtil.isFunction(declaration[name])) {
                prototype[name] = declaration[name];
            } else {
                throw new Error("Interface can only declare functions");
            }
        } else {
            throw new Error("Function '" + name + "' is already declared in sub-interface " + _interface);
        }
    }
    var newInterface = function() {};
    newInterface.prototype = prototype;
    newInterface.constructor = newInterface;
    return newInterface;
};
