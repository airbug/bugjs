//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('acesnippets.HtmlCompletions')

//@Require('ace.Ace')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var ace = bugpack.require('ace.Ace');

//-------------------------------------------------------------------------------
//
//-------------------------------------------------------------------------------

var HtmlCompletions = {};
HtmlCompletions.load = function() {

    ace.define('ace/snippets/html_completions', ['require', 'exports', 'module' ], function(require, exports, module) {


        exports.snippetText = "";
        exports.scope = "html_completions";

        });

};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('acesnippets.HtmlCompletions', HtmlCompletions);