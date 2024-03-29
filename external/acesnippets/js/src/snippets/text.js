//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('acesnippets.Text')

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

var Text = {};
Text.load = function() {

    ace.define('ace/snippets/text', ['require', 'exports', 'module' ], function(require, exports, module) {


        exports.snippetText = "";
        exports.scope = "text";

        });

};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('acesnippets.Text', Text);