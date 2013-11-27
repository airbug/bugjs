//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Bug')

//@Require('Class')
//@Require('Throwable')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Throwable       = bugpack.require('Throwable');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Bug = Class.extend(Throwable, {});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Bug', Bug);