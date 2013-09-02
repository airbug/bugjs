//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('buganno')

//@Export('AnnotationParserProcessor')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('buganno.AnnotationRegistry')
//@Require('buganno.BugAnnotation')
//@Require('bugfs.BugFs')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();
var child_process       = require('child_process');
var os                  = require('os');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var List                = bugpack.require('List');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var AnnotationRegistry  = bugpack.require('buganno.AnnotationRegistry');
var BugAnnotation       = bugpack.require('buganno.BugAnnotation');
var BugFs               = bugpack.require('bugfs.BugFs');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AnnotationParserProcessor = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array}
         */
        this.annotationParserProcesses  = new List();

        /**
         * @private
         * @type {number}
         */
        this.roundRobinIndex            = -1;

        /**
         * @private
         * @type {Map.<string, function(Error, AnnotationRegistry)}}
         */
        this.sourceFileToCallbackMap    = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {(string | Path)}
     * @param {function(Error, AnnotationRegistry)} callback
     */
    parse: function(sourceFile, callback) {
        sourceFile = BugFs.path(sourceFile);

        if (this.sourceFileToCallbackMap.getCount() === 0) {
            this.startProcesses();
        }

        //TODO BRN: This could break if more than one of the same sourceFile is processed at the same time.

        this.sourceFileToCallbackMap.put(sourceFile.getAbsolutePath(), callback);
        var annotationParserProcess = this.roundRobinNextProcess();
        annotationParserProcess.send({sourceFile: sourceFile.getAbsolutePath()});
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    roundRobinNextProcess: function() {
        var numberProcesses = this.annotationParserProcesses.getCount();
        if (numberProcesses > 0) {
            this.roundRobinIndex++;
            if (this.roundRobinIndex >= numberProcesses) {
                this.roundRobinIndex = 0;
            }
            return this.annotationParserProcesses.getAt(this.roundRobinIndex);
        }
        return undefined;
    },

    /**
     * @private
     */
    startProcesses: function() {
        var _this = this;
        var numCPUs = os.cpus().length;
        for (var i = 0; i < numCPUs; i++) {

            //TODO BRN: This seems pretty fragile. Perhaps there's a way to look up the location of a script by name?
            // OR we can figure out a way to inject code in to a process via string.

            var processPath = BugFs.resolvePaths([__dirname, "../scripts/annotation-parser-process-start.js"]);
            var childProcess = child_process.fork(processPath.getAbsolutePath());
            childProcess.on('message', function(message) {
                _this.handleChildMessage(message);
            });
            this.annotationParserProcesses.add(childProcess);
        }
    },

    /**
     * @private
     */
    stopProcesses: function() {
        this.annotationParserProcesses.forEach(function(annotationParserProcess) {
            annotationParserProcess.kill();
        });
        this.annotationParserProcesses.clear();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param message
     */
    handleChildMessage: function(message) {
        var error = undefined;
        var annotationRegistry = undefined;
        if (!message.error) {
            var annotationRegistryData = message.annotationRegistry;

            //TODO BRN: This part should be done by BugMarshaller

            annotationRegistry = new AnnotationRegistry(BugFs.path(annotationRegistryData.filePath));
            annotationRegistryData.annotationList.forEach(function(annotationData) {
                var annotation = new BugAnnotation(annotationData.type, annotationData.arguments);
                annotationRegistry.addAnnotation(annotation);
            });
        } else {
            error = new Error(message.message);
        }
        var sourceFile = message.sourceFile;
        var callback = this.sourceFileToCallbackMap.remove(sourceFile);
        if (this.sourceFileToCallbackMap.getCount() === 0) {
            this.stopProcesses();
        }
        callback(error, annotationRegistry);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('buganno.AnnotationParserProcessor', AnnotationParserProcessor);
