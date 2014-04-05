//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('ModuleScan')

//@Require('Class')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.AnnotationScan')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
var AnnotationScan      = bugpack.require('bugmeta.AnnotationScan');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {AnnotationScan}
 */
var ModuleScan = Class.extend(AnnotationScan, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MetaContext} metaContext
     * @param {ModuleAnnotationProcessor} processor
     */
    _constructor: function(metaContext, processor) {

        this._super(metaContext, processor, ModuleAnnotation.TYPE);

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.ModuleScan', ModuleScan);
