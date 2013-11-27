//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('PasswordUtil')

//@Require('TypeUtil')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var TypeUtil        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @type {{}}
 */
var PasswordUtil     = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {String} password
 * @returns {Boolean}
 */
PasswordUtil.isValid = function(password) {
    if (!TypeUtil.isString(password)) {
        return false;
    }
    if (password.length < 6) {
        return false;
    }
    return true;
};

PasswordUtil.requirementsString = "Your password must be at least 6 characters long";

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('PasswordUtil', PasswordUtil);