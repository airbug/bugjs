//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('acesnippets')

//@Export('Autohotkey')

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

var Autohotkey = {};
Autohotkey.load = function() {

    ace.define('ace/snippets/autohotkey', ['require', 'exports', 'module' ], function(require, exports, module) {


        exports.snippetText = "";
        exports.scope = "autohotkey";

        });

};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('acesnippets.Autohotkey', Autohotkey);