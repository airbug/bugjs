//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('acethemes')

//@Export('Latex')

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

var Latex = {};
Latex.load = function() {

    ace.define('ace/snippets/latex', ['require', 'exports', 'module' ], function(require, exports, module) {
        
        
        exports.snippetText = "";
        exports.scope = "latex";
        
        });
        
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('acesnippets.Latex', Latex);
