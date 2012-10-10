/**
 * This work is based on...
 * Simple JavaScript Inheritance (http://ejohn.org/blog/simple-javascript-inheritance/)
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */

//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@export('Class')

//@require('TypeUtil')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Class = {};

var Base = function() {};

Base._interfaces = [];

Base.getInterfaces = function() {
    return Base._interfaces;
};

Base.prototype._constructor = function() {

};

Base.prototype.getClass = function() {
    return this._class;
};


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

Class.extending = false;


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

Class.declare = function(declaration) {
    return Class.extend(Base, declaration);
};

Class.extend = function(_class, declaration) {
    var _super = _class.prototype;
    Class.extending = true;
    var prototype = new _class();
    Class.extending = false;
    for (var name in declaration) {
        prototype[name] = TypeUtil.isFunction(prototype[name]) ?
            (function(name, fn) {
                return function() {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;
                    return ret;
                };
            })(name, declaration[name]):
            declaration[name];
    }
    var newClass = function() {
        if (!Class.extending && this._constructor) {
            this._constructor.apply(this, arguments);
            this._class = newClass;
        }
    };
    newClass.prototype = prototype;
    newClass.constructor = newClass;
    newClass._interfaces = [];
    newClass.getInterfaces = function() {
        return newClass._interfaces;
    };
    _class.getInterfaces().forEach(function(_interface) {
        newClass._interfaces.push(_interface);
    });
    return newClass;
};

/**
 * @param {function()} _class
 * @param {function()} _interface
 */
Class.implement = function(_class, _interface) {
    _class.getInterfaces().forEach(function(implementedInterface) {
        if (implementedInterface === _interface) {
            throw new Error("Interface " + implementedInterface + " has already been implemented by this class");
        }
    });
    for (var methodName in _interface.prototype) {
        if (!TypeUtil.isFunction(_class.prototype[methodName])) {
            throw new Error("Class " + _class + " does not implement interface method '" + methodName + "'");
        }
    }
    _class._interfaces.push(_interface);
};

Class.doesExtend = function(value, _class) {
    return value instanceof _class;
};

Class.doesImplement = function(value, _interface) {
    if (Class.doesExtend(value, Base)) {
        for (var i = 0, size = value.getClass().getInterfaces().length; i < size; i++) {
            var implementedInterface = value.getClass().getInterfaces()[i];
            var implementedInterfaceInstance = new implementedInterface();
            if (implementedInterfaceInstance instanceof _interface) {
                return true;
            }
        }
    }
    return false;
};
