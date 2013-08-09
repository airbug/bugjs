//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityScan')

//@Require('Class')
//@Require('List')
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
var List                = bugpack.require('List');
var Obj                 = bugpack.require('Obj');
var EntityAnnotation    = bugpack.require('bugentity.EntityAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityScan = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Class} _class
     * @return {EntityAnnotation}
     */
    scanClass: function(_class) {
        //TODO BRN: Figure out how to handle child/parent classes

        var bugmeta     = BugMeta.context();
        var annotations = bugmeta.getAnnotationsByReference(_class);
        var entityAnnotation = null;
        if (annotations) {
            annotations.forEach(function(annotation) {
                if (Class.doesExtend(annotation, EntityAnnotation)) {
                    entityAnnotation = annotation;
                }
            });
        }
        return entityAnnotation;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityScan', EntityScan);
