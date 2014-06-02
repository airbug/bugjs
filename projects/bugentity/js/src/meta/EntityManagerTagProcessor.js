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

//@Export('bugentity.EntityManagerTagProcessor')

//@Require('Class')
//@Require('Set')
//@Require('bugentity.EntityManagerModuleFactory');
//@Require('bugioc.ModuleTagProcessor')


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
    var ModuleTagProcessor       = bugpack.require('bugioc.ModuleTagProcessor');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ModuleTagProcessor}
     */
    var EntityManagerTagProcessor = Class.extend(ModuleTagProcessor, {

        _name: "bugentity.EntityManagerTagProcessor",


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
             * @type {Set.<EntityManagerTag>}
             */
            this.processedEntityManagerTagSet   = new Set();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @param {EntityManagerTag} entityManagerTag
         */
        process: function(entityManagerTag) {
            this.processEntityManagerTag(entityManagerTag);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {EntityManagerTag} entityManagerTag
         */
        processEntityManagerTag: function(entityManagerTag) {
            if (!this.processedEntityManagerTagSet.contains(entityManagerTag)) {
                var entityManagerConstructor    = entityManagerTag.getTagReference();
                var entityManagerClass          = entityManagerConstructor.getClass();
                var iocModule                   = this.factoryIocModule(entityManagerTag);
                var factory                     = new EntityManagerModuleFactory(this.getIocContext(), iocModule, entityManagerClass,
                                                entityManagerTag.getEntityType());
                iocModule.setModuleFactory(factory);
                this.getIocContext().registerIocModule(iocModule);
                this.processedEntityManagerTagSet.add(entityManagerTag);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.EntityManagerTagProcessor', EntityManagerTagProcessor);
});
