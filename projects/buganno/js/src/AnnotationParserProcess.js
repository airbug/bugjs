//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('buganno')

//@Export('AnnotationParserProcess')

//@Require('Class')
//@Require('Obj')
//@Require('buganno.AnnotationParser')
//@Require('bugfs.BugFs')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();
var child_process       = require('child_process');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var AnnotationParser    = bugpack.require('buganno.AnnotationParser');
var BugFs               = bugpack.require('bugfs.BugFs');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AnnotationParserProcess = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(process) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.process = process;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    start: function() {
        var _this = this;
        this.process.on('message', function(message) {
            _this.handleMessage(message);
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------


    /**
     * @private
     * @param {string} message
     */
    error: function(message) {
        this.process.send({
            error: true,
            message: message
        });
    },

    /**
     * @private
     * @param {string} sourceFile
     */
    processSourceFile: function(sourceFile) {
        var _this = this;
        var filePath = BugFs.path(sourceFile);
        var annotationParser = new AnnotationParser(filePath);
        annotationParser.parse(function(error, annotationRegistry) {
            if (!error) {
                _this.process.send({
                    sourceFile: sourceFile,
                    annotationRegistry: annotationRegistry.toObject()
                });
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Message Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {{sourceFile: string}} message
     */
    handleMessage: function(message) {
        if (message.sourceFile) {
            this.processSourceFile(message.sourceFile);
        } else {
            this.error("RegistryBuilderChild received message that did not have a source file");
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('buganno.AnnotationParserProcess', AnnotationParserProcess);
