//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmeta')

//@Export('MetaContext')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('bugmeta.AnnotationProcessor')
//@Require('bugmeta.MetaDecorator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var List                    = bugpack.require('List');
var Map                     = bugpack.require('Map');
var Obj                     = bugpack.require('Obj');
var AnnotationProcessor     = bugpack.require('bugmeta.AnnotationProcessor');
var MetaDecorator           = bugpack.require('bugmeta.MetaDecorator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MetaContext = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map<string, List.<Annotation>>}
         */
        this.annotationMap                  = new Map();

        /**
         * @private
         * @type {Map<string, List<AnnotationProcessor>>}
         */
        this.annotationProcessorMap         = new Map();

        /**
         * @private
         * @type {Map.<*, List.<Annotation>>}
         */
        this.referenceToAnnotationListMap   = new Map();
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} reference
     * @return {MetaDecorator}
     */
    annotate: function(reference) {
        return new MetaDecorator(reference, this);
    },

    /**
     * @param {Annotation} annotation
     */
    addAnnotation: function(annotation) {
        var annotationTypeList = this.annotationMap.get(annotation.getAnnotationType());
        if (!annotationTypeList) {
            annotationTypeList = new List();
            this.annotationMap.put(annotation.getAnnotationType(), annotationTypeList);
        }
        annotationTypeList.add(annotation);
        var annotationReferenceList = this.referenceToAnnotationListMap.get(annotation.getAnnotationReference());
        if (!annotationReferenceList) {
            annotationReferenceList = new List();
            this.referenceToAnnotationListMap.put(annotation.getAnnotationReference(), annotationReferenceList);
        }
        this.processAnnotation(annotation);
    },

    /**
     * @param {*} reference
     * @return {List.<Annotation>}
     */
    getAnnotationsByReference: function(reference) {
        return this.referenceToAnnotationListMap.get(reference);
    },

    /**
     * @param {string} annotationType
     * @return {List<Annotation>}
     */
    getAnnotationsByType: function(annotationType) {
        //TODO BRN (QUESTION): Should we clone this list to prevent breakage?
        return this.annotationMap.get(annotationType);
    },

    /**
     * @param {Annotation} annotation
     */
    processAnnotation: function(annotation) {
        var annotationProcessorTypeList = this.annotationProcessorMap.get(annotation.getAnnotationType());
        if (annotationProcessorTypeList) {
            annotationProcessorTypeList.forEach(function(annotationProcessor) {
                annotationProcessor.processAnnotation(annotation);
            });
        }
    },

    /**
     * @param {string} annotationType
     * @param {function(Annotation)} annotationProcessorFunction
     */
    registerAnnotationProcessor: function(annotationType, annotationProcessorFunction) {
        var annotationProcessorTypeList = this.annotationProcessorMap.get(annotationType);
        if (!annotationProcessorTypeList) {
            annotationProcessorTypeList = new List();
            this.annotationProcessorMap.put(annotationType, annotationProcessorTypeList);
        }
        var annotationProcessor = new AnnotationProcessor(annotationProcessorFunction);
        annotationProcessorTypeList.add(annotationProcessor);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmeta.MetaContext', MetaContext);
