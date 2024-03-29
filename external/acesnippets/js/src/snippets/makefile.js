//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('acesnippets.Makefile')

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

var Makefile = {};
Makefile.load = function() {

    ace.define('ace/snippets/makefile', ['require', 'exports', 'module' ], function(require, exports, module) {


        exports.snippetText = "snippet ifeq\n\
        	ifeq (${1:cond0},${2:cond1})\n\
        		${3:code}\n\
        	endif\n\
        ";
        exports.scope = "makefile";

        });

};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('acesnippets.Makefile', Makefile);