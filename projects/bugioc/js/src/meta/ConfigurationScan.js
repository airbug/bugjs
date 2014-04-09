//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.ConfigurationScan')

//@Require('Class')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugmeta.AnnotationScan')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var ConfigurationAnnotation     = bugpack.require('bugioc.ConfigurationAnnotation');
var AnnotationScan              = bugpack.require('bugmeta.AnnotationScan');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {AnnotationScan}
 */
var ConfigurationScan = Class.extend(AnnotationScan, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MetaContext} metaContext
     * @param {ConfigurationAnnotationProcessor} processor
     */
    _constructor: function(metaContext, processor) {
        this._super(metaContext, processor, ConfigurationAnnotation.TYPE);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.ConfigurationScan', ConfigurationScan);
