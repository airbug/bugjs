//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.CallResponseHandlerFactory')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.CallResponseHandler')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var CallResponseHandler         = bugpack.require('bugcall.CallResponseHandler');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var module                      = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 * @implements {IInitializeModule}
 * @implements {IProcessCall}
 */
var CallResponseHandlerFactory = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable, CallResponse=)} responseHandlerFunction
     * @param {Object=} responseHandlerContext
     * @returns {CallResponseHandler}
     */
    factoryCallResponseHandler: function(responseHandlerFunction, responseHandlerContext) {
        return new CallResponseHandler(responseHandlerFunction, responseHandlerContext);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CallResponseHandlerFactory).with(
    module("callResponseHandlerFactory")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallResponseHandlerFactory', CallResponseHandlerFactory);
