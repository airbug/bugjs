//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.AutowiredScan')

//@Require('Class')
//@Require('Obj')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var BugMeta     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AutowiredScan = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {AutowiredAnnotationProcessor} processor
     */
    _constructor: function(processor) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AutowiredAnnotationProcessor}
         */
        this.processor = processor;

        /**
         * @priavate
         * @type {boolean}
         */
        this.scanning   = false;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    scanAll: function() {
        var _this = this;
        var bugmeta = BugMeta.context();
        var autowiredAnnotations = bugmeta.getAnnotationsByType("Autowired");
        if (autowiredAnnotations) {
            autowiredAnnotations.forEach(function(annotation) {
                _this.processor.process(annotation);
            });
        }
    },

    /**
     *
     */
    scanContinuous: function() {
        var _this = this;
        if (!this.scanning) {
            this.scanning = true;
            var bugmeta                 = BugMeta.context();
            bugmeta.registerAnnotationProcessor("Autowired", function(annotation) {
                _this.processor.process(annotation);
            });
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.AutowiredScan', AutowiredScan);
