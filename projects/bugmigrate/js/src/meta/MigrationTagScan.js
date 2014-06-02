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

//@Export('bugmigrate.MigrationTagScan')

//@Require('Class')
//@Require('bugmeta.TagScan')
//@Require('bugmigrate.MigrationTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var TagScan         = bugpack.require('bugmeta.TagScan');
    var MigrationTag    = bugpack.require('bugmigrate.MigrationTag');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {TagScan}
     */
    var MigrationTagScan = Class.extend(TagScan, {

        _name: "bugmigrate.MigrationTagScan",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MetaContext} metaContext
         * @param {MigrationTagProcessor} processor
         */
        _constructor: function(metaContext, processor) {
            this._super(metaContext, processor, MigrationTag.TYPE);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmigrate.MigrationTagScan', MigrationTagScan);
});
