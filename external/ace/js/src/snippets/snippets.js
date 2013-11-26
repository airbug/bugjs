//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('acethemes')

//@Export('Snippets')

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

var Snippets = {};
Snippets.load = function() {

    ace.define('ace/snippets/snippets', ['require', 'exports', 'module' ], function(require, exports, module) {
        
        
        exports.snippetText = "# snippets for making snippets :)\n\
        snippet snip\n\
        	snippet ${1:trigger}\n\
        		${2}\n\
        snippet msnip\n\
        	snippet ${1:trigger} ${2:description}\n\
        		${3}\n\
        snippet v\n\
        	{VISUAL}\n\
        ";
        exports.scope = "snippets";
        
        });
        
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('acesnippets.Snippets', Snippets);
