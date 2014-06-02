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

    var Class                   = bugpack.require('Class');
    var TagScan          = bugpack.require('bugmeta.TagScan');
    var MigrationTag     = bugpack.require('bugmigrate.MigrationTag');


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
