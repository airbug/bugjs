//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmeta')

//@Export('BugMeta')

//@Require('Class')
//@Require('Obj')
//@Require('bugmeta.MetaContext')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var MetaContext             = bugpack.require('bugmeta.MetaContext');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugMeta = Class.extend(Obj, {});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @private
 * @type {MetaContext}
 */
BugMeta.metaContext = null;


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @return {MetaContext}
 */
BugMeta.context = function() {
    if (!BugMeta.metaContext) {
        BugMeta.metaContext = new MetaContext();
    }
    return BugMeta.metaContext;
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmeta.BugMeta', BugMeta);
