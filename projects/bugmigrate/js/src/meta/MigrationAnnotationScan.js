//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmigrate.MigrationAnnotationScan')

//@Require('Class')
//@Require('bugmeta.AnnotationScan')
//@Require('bugmigrate.MigrationAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var AnnotationScan          = bugpack.require('bugmeta.AnnotationScan');
var MigrationAnnotation     = bugpack.require('bugmigrate.MigrationAnnotation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {AnnotationScan}
 */
var MigrationAnnotationScan = Class.extend(AnnotationScan, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MetaContext} metaContext
     * @param {MigrationAnnotationProcessor} processor
     */
    _constructor: function(metaContext, processor) {
        this._super(metaContext, processor, MigrationAnnotation.TYPE);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmigrate.MigrationAnnotationScan', MigrationAnnotationScan);
