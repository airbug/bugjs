//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('Annotate')

//@Require('Annotation')
//@Require('AnnotationProcessor')
//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')


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

Annotate.annotationMap = new Map();

Annotate.annotationProcessorMap = new Map();

Annotate.processingAnnotationsTimeout = null;


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
