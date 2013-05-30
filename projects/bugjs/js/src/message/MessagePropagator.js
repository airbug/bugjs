//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MessagePropagator')

//@Require('Class')
//@Require('EventPropagator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventPropagator     = bugpack.require('EventPropagator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessagePropagator = Class.extend(EventPropagator, {});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('MessagePropagator', MessagePropagator);
