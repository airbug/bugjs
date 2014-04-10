//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.AutowiredScan')

//@Require('Class')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugmeta.AnnotationScan')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var AnnotationScan          = bugpack.require('bugmeta.AnnotationScan');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {AnnotationScan}
 */
var AutowiredScan = Class.extend(AnnotationScan, /** @lends {AutowiredScan.prototype} */{

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MetaContext} metaContext
     * @param {AutowiredAnnotationProcessor} processor
     */
    _constructor: function(metaContext, processor) {

        this._super(metaContext, processor, AutowiredAnnotation.TYPE);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.scanning       = false;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    scanContinuous: function() {
        var _this = this;
        if (!this.scanning) {
            this.scanning = true;
            var bugmeta                 = BugMeta.context();
            bugmeta.registerAnnotationProcessor("Autowired", function(annotation) {
                _this.getProcessor().process(annotation);
            });
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.AutowiredScan', AutowiredScan);
