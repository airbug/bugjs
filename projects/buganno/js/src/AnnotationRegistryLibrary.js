//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('buganno')

//@Export('AnnotationRegistryLibrary')

//@Require('Class')
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
var List        = bugpack.require('List');
var Map         = bugpack.require('Map');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AnnotationRegistryLibrary = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {List.<AnnotationRegistry>}
         */
        this.annotationRegistryList             = new List();

        /**
         * @private
         * @type {Map.<string, List.<Annotation>>}
         */
        this.filePathToAnnotationRegistryMap    = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {List.<AnnotationRegistry>}
     */
    getAnnotationRegistryList: function() {
        return this.annotationRegistryList;
    },

    /**
     * @param {Path} filePath
     */
    getAnnotationRegistryByFilePath: function(filePath) {
        return this.filePathToAnnotationRegistryMap.get(filePath);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {AnnotationRegistry} annotationRegistry
     */
    addAnnotationRegistry: function(annotationRegistry) {
        this.annotationRegistryList.add(annotationRegistry);
        this.filePathToAnnotationRegistryMap.put(annotationRegistry.getFilePath(), annotationRegistry);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('buganno.AnnotationRegistryLibrary', AnnotationRegistryLibrary);
