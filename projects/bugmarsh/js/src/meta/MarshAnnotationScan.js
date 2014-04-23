//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmarsh.MarshAnnotationScan')

//@Require('Class')
//@Require('bugmarsh.MarshAnnotation')
//@Require('bugmeta.AnnotationScan')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var MarshAnnotation     = bugpack.require('bugmarsh.MarshAnnotation');
    var AnnotationScan      = bugpack.require('bugmeta.AnnotationScan');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {AnnotationScan}
     */
    var MarshAnnotationScan = Class.extend(AnnotationScan, {

        _name: "bugmarsh.MarshAnnotationScan",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MetaContext} metaContext
         * @param {MarshAnnotationProcessor} processor
         */
        _constructor: function(metaContext, processor) {
            this._super(metaContext, processor, MarshAnnotation.TYPE);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmarsh.MarshAnnotationScan', MarshAnnotationScan);
});
