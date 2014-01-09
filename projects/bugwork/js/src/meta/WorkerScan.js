//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugwork')

//@Export('WorkerScan')

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

var WorkerScan = Class.extend(AnnotationScan, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {AnnotationProcessor} processor
     */
    _constructor: function(processor) {
        this._super(processor, WorkerAnnotation.TYPE);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugwork.WorkerScan', WorkerScan);
