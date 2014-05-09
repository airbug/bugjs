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

//@Export('bugentity.EntityManagerAnnotationProcessor')

//@Require('Class')
//@Require('Set')
//@Require('bugentity.EntityManagerModuleFactory');
//@Require('bugioc.ModuleAnnotationProcessor')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var Set                             = bugpack.require('Set');
    var EntityManagerModuleFactory      = bugpack.require('bugentity.EntityManagerModuleFactory');
    var ModuleAnnotationProcessor       = bugpack.require('bugioc.ModuleAnnotationProcessor');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ModuleAnnotationProcessor}
     */
    var EntityManagerAnnotationProcessor = Class.extend(ModuleAnnotationProcessor, {

        _name: "bugentity.EntityManagerAnnotationProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IocContext} iocContext
         */
        _constructor: function(iocContext) {

            this._super(iocContext);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Set.<EntityManagerAnnotation>}
             */
            this.processedEntityManagerAnnotationSet   = new Set();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @param {EntityManagerAnnotation} entityManagerAnnotation
         */
        process: function(entityManagerAnnotation) {
            this.processEntityManagerAnnotation(entityManagerAnnotation);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {EntityManagerAnnotation} entityManagerAnnotation
         */
        processEntityManagerAnnotation: function(entityManagerAnnotation) {
            if (!this.processedEntityManagerAnnotationSet.contains(entityManagerAnnotation)) {
                var entityManagerConstructor    = entityManagerAnnotation.getAnnotationReference();
                var entityManagerClass          = entityManagerConstructor.getClass();
                var iocModule                   = this.factoryIocModule(entityManagerAnnotation);
                var factory                     = new EntityManagerModuleFactory(this.getIocContext(), iocModule, entityManagerClass,
                                                entityManagerAnnotation.getEntityType());
                iocModule.setModuleFactory(factory);
                this.getIocContext().registerIocModule(iocModule);
                this.processedEntityManagerAnnotationSet.add(entityManagerAnnotation);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.EntityManagerAnnotationProcessor', EntityManagerAnnotationProcessor);
});
