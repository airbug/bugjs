//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmeta')

//@Export('Annotation')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Obj =   bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var Annotation = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} annotationType
     */
    _constructor: function(annotationType) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.annotationReference    = null;

        /**
         * @private
         * @type {string}
         */
        this.annotationType         = annotationType;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getAnnotationReference: function() {
        return this.annotationReference;
    },

    /**
     * @param {*} annotationReference
     */
    setAnnotationReference: function(annotationReference) {
        this.annotationReference = annotationReference;
    },

    /**
     * @return {string}
     */
    getAnnotationType: function() {
        return this.annotationType;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmeta.Annotation', Annotation);
