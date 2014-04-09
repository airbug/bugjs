//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugentity.EntityManagerScan')

//@Require('Class')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugmeta.AnnotationScan')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var AnnotationScan              = bugpack.require('bugmeta.AnnotationScan');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {AnnotationScan}
 */
var EntityManagerScan = Class.extend(AnnotationScan, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MetaContext} metaContext
     * @param {EntityManagerAnnotationProcessor} processor
     */
    _constructor: function(metaContext, processor) {
        this._super(metaContext, processor, EntityManagerAnnotation.TYPE);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityManagerScan', EntityManagerScan);
