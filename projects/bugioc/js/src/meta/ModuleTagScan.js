//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.ModuleTagScan')

//@Require('Class')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.TagScan')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var ModuleTag    = bugpack.require('bugioc.ModuleTag');
    var TagScan      = bugpack.require('bugmeta.TagScan');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {TagScan}
     */
    var ModuleTagScan = Class.extend(TagScan, {

        _name: "bugioc.ModuleTagScan",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MetaContext} metaContext
         * @param {ModuleTagProcessor} processor
         */
        _constructor: function(metaContext, processor) {

            this._super(metaContext, processor, ModuleTag.TYPE);

        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.ModuleTagScan', ModuleTagScan);
});
