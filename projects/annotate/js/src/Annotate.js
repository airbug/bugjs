//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('Annotate')

//@Require('Annotation')
//@Require('AnnotationProcessor')
//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('Annotate');

var Annotation = bugpack.require('Annotation');
var AnnotationProcessor = bugpack.require('AnnotationProcessor');
var Class = bugpack.require('Class');
var List = bugpack.require('List');
var Map = bugpack.require('Map');
var Obj = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Annotate = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(reference) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.reference = reference;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {...*}
     */
    with: function() {
        for (var i = 0, size = arguments.length; i < size; i++) {
            var annotation = arguments[i];
            var annotationTypeList =  Annotate.annotationMap.get(annotation.getType());
            if (!annotationTypeList) {
                annotationTypeList = new List();
                Annotate.annotationMap.put(annotation.getType(), annotationTypeList);
            }
            annotationTypeList.add(annotation);
            annotation.setReference(this.reference);
            Annotate.processAnnotation(annotation);
        }

        // NOTE BRN: Return the reference so that whatever function we're annotating is passed through and the reference
        // is assigned correctly.

        return this.reference;
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @private
 * @type {Map<string, List<Annotation>>}
 */
Annotate.annotationMap = new Map();

/**
 * @private
 * @type {Map<string, List<AnnotationProcessor>>}
 */
Annotate.annotationProcessorMap = new Map();


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {*} reference
 * @return {Annotate}
 */
Annotate.annotate = function(reference) {
    return new Annotate(reference);
};

/**
 * @param {string} annotationType
 * @return {Annotation}
 */
Annotate.annotation = function(annotationType) {
    return new Annotation(annotationType);
};

/**
 * @param {string} annotationType
 * @return {List<Annotation>}
 */
Annotate.getAnnotationsByType = function(annotationType) {
    //TODO BRN (QUESTION): Should we clone this list to prevent breakage?
    return Annotate.annotationMap.get(annotationType);
};

/**
 * @param {Annotation} annotation
 */
Annotate.processAnnotation = function(annotation) {
    var annotationProcessorTypeList = Annotate.annotationProcessorMap.get(annotation.getType());
    if (annotationProcessorTypeList) {
        annotationProcessorTypeList.forEach(function(annotationProcessor) {
            annotationProcessor.processAnnotation(annotation);
        });
    }
};

/**
 * @param {string} annotationType
 * @param {function(Annotation)} annotationProcessorFunction
 */
Annotate.registerAnnotationProcessor = function(annotationType, annotationProcessorFunction) {
    var annotationProcessorTypeList = Annotate.annotationProcessorMap.get(annotationType);
    if (!annotationProcessorTypeList) {
        annotationProcessorTypeList = new List();
        Annotate.annotationProcessorMap.put(annotationType, annotationProcessorTypeList);
    }
    var annotationProcessor = new AnnotationProcessor(annotationProcessorFunction);
    annotationProcessorTypeList.add(annotationProcessor);

    // Process any annotations that have already been registered for this type.

    var annotationTypeList =  Annotate.annotationMap.get(annotationType);
    if (annotationTypeList) {
        annotationTypeList.forEach(function(annotation) {
            Annotate.processAnnotation(annotation);
        });
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(Annotate);
