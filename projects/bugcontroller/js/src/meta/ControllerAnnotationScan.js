/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcontroller.ControllerAnnotationScan')

//@Require('Class')
//@Require('bugcontroller.ControllerAnnotation')
//@Require('bugmeta.AnnotationScan')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var ControllerAnnotation        = bugpack.require('bugcontroller.ControllerAnnotation');
    var AnnotationScan              = bugpack.require('bugmeta.AnnotationScan');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {AnnotationScan}
     */
    var ControllerAnnotationScan = Class.extend(AnnotationScan, {

        _name: "bugcontroller.ControllerAnnotationScan",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MetaContext} metaContext
         * @param {ControllerAnnotationProcessor} processor
         */
        _constructor: function(metaContext, processor) {
            this._super(metaContext, processor, ControllerAnnotation.TYPE);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcontroller.ControllerAnnotationScan', ControllerAnnotationScan);
});
