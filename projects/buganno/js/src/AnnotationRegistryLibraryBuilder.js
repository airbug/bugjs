//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('buganno')

//@Export('AnnotationRegistryLibraryBuilder')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('buganno.AnnotationParserProcessor')
//@Require('buganno.AnnotationRegistryLibrary')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var List                        = bugpack.require('List');
var Map                         = bugpack.require('Map');
var Obj                         = bugpack.require('Obj');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
var AnnotationParserProcessor   = bugpack.require('buganno.AnnotationParserProcessor');
var AnnotationRegistryLibrary   = bugpack.require('buganno.AnnotationRegistryLibrary');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $iterableParallel   = BugFlow.$iterableParallel;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AnnotationRegistryLibraryBuilder = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AnnotationParserProcessor}
         */
        this.annotationParserProcessor = new AnnotationParserProcessor();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {(Array.<(string | Path)> | List.<(string | Path)>} filePaths
     * @param {function(Error, AnnotationRegistryLibrary)} callback
     */
    build: function(filePaths, callback) {
        var _this                       = this;
        var annotationRegistryLibrary   = new AnnotationRegistryLibrary();
        var filePathList                = new List(filePaths);
        $iterableParallel(filePathList, function(flow, filePath) {
            _this.annotationParserProcessor.parse(filePath, function(error, annotationRegistry) {
                if (!error) {
                    annotationRegistryLibrary.addAnnotationRegistry(annotationRegistry);
                }
                flow.complete(error);
            });
        }).execute(function(error) {
            if (!error) {
                callback(undefined, annotationRegistryLibrary);
            } else {
                callback(error);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('buganno.AnnotationRegistryLibraryBuilder', AnnotationRegistryLibraryBuilder);
