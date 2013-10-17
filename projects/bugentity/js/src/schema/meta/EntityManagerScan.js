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
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Class} _class
     * @return {EntityManagerAnnotation}
     */
    scanClass: function(_class) {
        var bugmeta     = BugMeta.context();
        var annotations = bugmeta.getAnnotationsByReference(_class);
        var entityManagerAnnotation = null;
        if (annotations) {
            annotations.forEach(function(annotation) {
                if (Class.doesExtend(annotation, EntityManagerAnnotation)) {
                    entityManagerAnnotation = annotation;
                }
            });
        }
        return entityManagerAnnotation;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityManagerScan', EntityManagerScan);
