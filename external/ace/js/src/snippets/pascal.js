//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('acethemes')

//@Export('Pascal')

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

var Pascal = {};
Pascal.load = function() {

    ace.define('ace/snippets/pascal', ['require', 'exports', 'module' ], function(require, exports, module) {
        
        
        exports.snippetText = "";
        exports.scope = "pascal";
        
        });
        
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('acesnippets.Pascal', Pascal);
