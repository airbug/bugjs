//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityManagerScan')

//@Require('Class')
//@Require('Obj')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityManagerScan = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {EntityManagerAnnotationProcessor} processor
     */
    _constructor: function(processor) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {EntityManagerAnnotationProcessor}
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
        var entityManagerAnnotations = bugmeta.getAnnotationsByType("EntityManager");
        if (entityManagerAnnotations) {
            entityManagerAnnotations.forEach(function(annotation) {

                //TEST
                console.log("EntityManager annotation");
                console.log(annotation);

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
        var entityManagerAnnotation = null;
        if (annotations) {
            annotations.forEach(function(annotation) {
                if (Class.doesExtend(annotation, EntityManagerAnnotation)) {
                    _this.processor.process(annotation);
                }
            });
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityManagerScan', EntityManagerScan);
