//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmeta')

//@Export('AnnotationProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var TypeUtil    = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var AnnotationProcessor = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {function(Annotation)} processorFunction
     */
    _constructor: function(processorFunction) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        if (!TypeUtil.isFunction(processorFunction)) {
            throw new Error("processorFunction must be a function");
        }
        /**
         * @private
         * @type {function(Annotation)}
         */
        this.processorFunction = processorFunction;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {function(Annotation)}
     */
    getProcessorFunction: function() {
        return this.processorFunction;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Annotation} annotation
     */
    processAnnotation: function(annotation) {
        this.processorFunction.call(null, annotation);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmeta.AnnotationProcessor', AnnotationProcessor);
