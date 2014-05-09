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

//@Export('bugentity.EntityManagerAnnotationScan')

//@Require('Class')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugmeta.AnnotationScan')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
    var AnnotationScan              = bugpack.require('bugmeta.AnnotationScan');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {AnnotationScan}
     */
    var EntityManagerAnnotationScan = Class.extend(AnnotationScan, {

        _name: "bugentity.EntityManagerAnnotationScan",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MetaContext} metaContext
         * @param {EntityManagerAnnotationProcessor} processor
         */
        _constructor: function(metaContext, processor) {
            this._super(metaContext, processor, EntityManagerAnnotation.TYPE);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.EntityManagerAnnotationScan', EntityManagerAnnotationScan);
});
