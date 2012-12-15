//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('Proxy')

//@Require('Class')
//@Require('Obj')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Obj = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Proxy = Class.extend(Obj, {});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {Object} proxyInstance
 * @param {Object} proxiedInstance
 * @param {Array<string>} functionNameArray
 */
Proxy.proxy = function(proxyInstance, proxiedInstance, functionNameArray) {
    for (var i = 0, size = functionNameArray.length; i < size; i++) {
        var functionName = functionNameArray[i];
        proxyInstance[functionName] = Proxy.generateProxyFunction(proxiedInstance, functionName);
    }
};

/**
 * @param {Object} proxiedInstance
 * @param {string} functionName
 * @return {function()}
 */
Proxy.generateProxyFunction = function(proxiedInstance, functionName) {
    return function() {
        return proxiedInstance[functionName].apply(proxiedInstance, arguments);
    };
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(Proxy);
