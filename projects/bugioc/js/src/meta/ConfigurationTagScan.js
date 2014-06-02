//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.ConfigurationTagScan')

//@Require('Class')
//@Require('bugioc.ConfigurationTag')
//@Require('bugmeta.TagScan')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var ConfigurationTag     = bugpack.require('bugioc.ConfigurationTag');
    var TagScan              = bugpack.require('bugmeta.TagScan');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {TagScan}
     */
    var ConfigurationTagScan = Class.extend(TagScan, {

        _name: "bugioc.ConfigurationTagScan",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MetaContext} metaContext
         * @param {ConfigurationTagProcessor} processor
         */
        _constructor: function(metaContext, processor) {
            this._super(metaContext, processor, ConfigurationTag.TYPE);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.ConfigurationTagScan', ConfigurationTagScan);
});
