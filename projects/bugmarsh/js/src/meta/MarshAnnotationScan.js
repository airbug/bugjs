//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmarsh.MarshAnnotationScan')

//@Require('Class')
//@Require('bugmarsh.MarshAnnotation')
//@Require('bugmeta.AnnotationScan')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var MarshAnnotation     = bugpack.require('bugmarsh.MarshAnnotation');
var AnnotationScan      = bugpack.require('bugmeta.AnnotationScan');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {AnnotationScan}
 */
var MarshAnnotationScan = Class.extend(AnnotationScan, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MetaContext} metaContext
     * @param {MarshAnnotationProcessor} processor
     */
    _constructor: function(metaContext, processor) {
        this._super(metaContext, processor, MarshAnnotation.TYPE);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmarsh.MarshAnnotationScan', MarshAnnotationScan);
