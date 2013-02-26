//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Proxy')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Obj =       bugpack.require('Obj');
var TypeUtil =  bugpack.require('TypeUtil');


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
        if (TypeUtil.isFunction(proxiedInstance)) {
            proxiedInstance = proxiedInstance();
        }

        if (TypeUtil.isObject(proxiedInstance)) {
            return proxiedInstance[functionName].apply(proxiedInstance, arguments);
        } else {
            throw new Error("Proxied entities must be objects or functions that return objects.");
        }
    };
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Proxy', Proxy);
