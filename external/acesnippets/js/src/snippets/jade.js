//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('acesnippets.Jade')

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

var Jade = {};
Jade.load = function() {

    ace.define('ace/snippets/jade', ['require', 'exports', 'module' ], function(require, exports, module) {


        exports.snippetText = "";
        exports.scope = "jade";

        });

};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('acesnippets.Jade', Jade);