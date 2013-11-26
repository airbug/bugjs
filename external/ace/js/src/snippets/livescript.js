//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('acethemes')

//@Export('Livescript')

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

var Livescript = {};
Livescript.load = function() {

    ace.define('ace/snippets/livescript', ['require', 'exports', 'module' ], function(require, exports, module) {
        
        
        exports.snippetText = "";
        exports.scope = "livescript";
        
        });
        
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('acesnippets.Livescript', Livescript);
