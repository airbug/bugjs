//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityScan')

//@Require('Class')
//@Require('Obj')
//@Require('bugentity.EntityAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var EntityAnnotation    = bugpack.require('bugentity.EntityAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityScan = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {EntityProcessor} processor
     */
    _constructor: function(processor) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {EntityProcessor}
         */
        this.processor = processor;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    scanAll: function() {
        var _this       = this;
        var bugmeta     = BugMeta.context();
        var entityAnnotations = bugmeta.getAnnotationsByType("Entity");
        if (entityAnnotations) {
            entityAnnotations.forEach(function(annotation) {
                _this.processor.process(annotation);
            });
        }
    },

    /**
     * @param {Class} _class
     */
    scanClass: function(_class) {
        var _this       = this;
        var bugmeta     = BugMeta.context();
        var annotations = bugmeta.getAnnotationsByReference(_class);
        if (annotations) {
            annotations.forEach(function(annotation) {
                if (Class.doesExtend(annotation, EntityAnnotation)) {
                    _this.processor.process(annotation);
                }
            });
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityScan', EntityScan);
