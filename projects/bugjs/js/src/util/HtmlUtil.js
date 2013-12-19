//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HtmlUtil')

//@Require('ArgUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil = bugpack.require('ArgUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HtmlUtil = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {string} value
 * @return {string}
 */
HtmlUtil.escapeHtml = function(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

/**
 * @static
 * @param {string} value
 * @return {string}
 */
HtmlUtil.stringToHtml = function(value) {
    var args = ArgUtil.process(arguments, [
        {name: "value", optional: false, type: "string"}
    ]);
    value       = args.value;
    var html    = HtmlUtil.escapeHtml(value);
    return HtmlUtil.newlineToBr(html);
};

/**
 * @static
 * @param {string} value
 * @param {boolean=} isXhtml
 * @return {string}
 */
HtmlUtil.newlineToBr = function(value, isXhtml) {
    var breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br />' : '<br>';
    return (value + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('HtmlUtil', HtmlUtil);
