//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HtmlUtil')

//@Require('ArgUtil')
//@Require('Url')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil     = bugpack.require('ArgUtil');
var Url         = bugpack.require('Url');


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
 * @return {string}
 */
HtmlUtil.urlsToHtmlATags = function(value) {
    var regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g;
    return value.replace(regex, function(match) {
        var url = Url.parse(match);
        return '<a href="' + url.toString() + '">' + match + '</a>';
    });
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
