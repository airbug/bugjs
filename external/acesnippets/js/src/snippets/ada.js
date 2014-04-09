//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('acesnippets.Ada')

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

var Ada = {};
Ada.load = function() {

    ace.define('ace/snippets/ada', ['require', 'exports', 'module' ], function(require, exports, module) {


        exports.snippetText = "";
        exports.scope = "ada";

        });

};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('acesnippets.Ada', Ada);