//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@export('TypeUtil')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

// NOTE BRN: We don't use the base level Class system here because our low level Object class depends on this class
// and Class depends on Object. Thus, if this class depends on Class it creates s circular dependency.

var TypeUtil = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

TypeUtil.isArray = function(value) {
    return value !== null && value !== undefined && value instanceof Array;
};

TypeUtil.isBoolean = function(value) {
    return value !== null && value !== undefined && (typeof value === 'boolean' || value instanceof Boolean);
};

TypeUtil.isFunction = function(value) {
    return value !== null && value !== undefined && typeof value === "function";
};

TypeUtil.isNull = function(value) {
    return value === null;
};

TypeUtil.isNumber = function(value) {
    return value !== null && value !== undefined && (typeof value === 'number' || value instanceof Number);
};

TypeUtil.isObject = function(value) {
    return value !== null && value !== undefined && typeof value === 'object' && !TypeUtil.isArray(value) &&
        !TypeUtil.isBoolean(value) && !TypeUtil.isNumber(value) && !TypeUtil.isString(value);
};

TypeUtil.isString = function(value) {
    return value !== null && value !== undefined && (typeof value === 'string' ||
        (typeof value === 'object' && value.constructor.toString().match(/function String\(\)/i) !== null));
};

TypeUtil.isUndefined = function(value) {
    return value === undefined;
};
