//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('acethemes')

//@Export('C9search')

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

var C9search = {};
C9search.load = function() {

    ace.define('ace/snippets/c9search', ['require', 'exports', 'module' ], function(require, exports, module) {
        
        
        exports.snippetText = "";
        exports.scope = "c9search";
        
        });
        
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('acesnippets.C9search', C9search);
