//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('buganno')

//@Export('AnnotationRegistry')

//@Require('Class')
//@Require('IObjectable')
//@Require('List')
//@Require('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var IObjectable = bugpack.require('IObjectable');
var List        = bugpack.require('List');
var Map         = bugpack.require('Map');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AnnotationRegistry = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {Path} filePath
     */
    _constructor: function(filePath) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {List.<Annotation>}
         */
        this.annotationList     = new List();

        /**
         * @private
         * @type {Map.<string, List.<Annotation>>}
         */
        this.annotationTypeMap  = new Map();

        /**
         * @private
         * @type {Path}
         */
        this.filePath           = filePath;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @return {List.<Annotation>}
     */
    getAnnotationList: function() {
        return this.annotationList;
    },

    /**
     * @return {Path}
     */
    getFilePath: function() {
        return this.filePath;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        var annotationRegistryData = {
            filePath: this.filePath.getAbsolutePath(),
            annotationList: []
        };
        this.annotationList.forEach(function(annotation) {
            annotationRegistryData.annotationList.push(annotation.toObject());
        });
        return annotationRegistryData;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Annotation} annotation
     */
    addAnnotation: function(annotation) {
        this.annotationList.add(annotation);
        var annotationTypeList = this.annotationTypeMap.get(annotation.getType());
        if (!annotationTypeList) {
            annotationTypeList = new List();
            this.annotationTypeMap.put(annotation.getType(), annotationTypeList);
        }
        annotationTypeList.add(annotation);
    },

    /**
     * @param {string} type
     * @return {List.<Annotation>)
     */
    getAnnotationListByType: function(type) {
        return this.annotationTypeMap.get(type);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(AnnotationRegistry, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('buganno.AnnotationRegistry', AnnotationRegistry);
