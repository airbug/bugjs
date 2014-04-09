//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugwork.WorkerScan')

//@Require('Class')
//@Require('Obj')
//@Require('bugmeta.AnnotationScan')
//@Require('bugwork.WorkerAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var AnnotationScan              = bugpack.require('bugmeta.AnnotationScan');
var WorkerAnnotation            = bugpack.require('bugwork.WorkerAnnotation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {AnnotationScan}
 */
var WorkerScan = Class.extend(AnnotationScan, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MetaContext} metaContext
     * @param {AnnotationProcessor} processor
     */
    _constructor: function(metaContext, processor) {
        this._super(metaContext, processor, WorkerAnnotation.TYPE);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugwork.WorkerScan', WorkerScan);
