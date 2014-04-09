//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('acesnippets.Sass')

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

var Sass = {};
Sass.load = function() {

    ace.define('ace/snippets/sass', ['require', 'exports', 'module' ], function(require, exports, module) {


        exports.snippetText = "";
        exports.scope = "sass";

        });

};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('acesnippets.Sass', Sass);