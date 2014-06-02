//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugservice.ServiceTagScan')

//@Require('Class')
//@Require('bugmeta.TagScan')
//@Require('bugservice.ServiceTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var TagScan          = bugpack.require('bugmeta.TagScan');
    var ServiceTag   = bugpack.require('bugservice.ServiceTag');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {TagScan}
     */
    var ServiceTagScan = Class.extend(TagScan, {

        _name: "bugservice.ServiceTagScan",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MetaContext} metaContext
         * @param {ServiceTagProcessor} processor
         */
        _constructor: function(metaContext, processor) {
            this._super(metaContext, processor, ServiceTag.TYPE);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugservice.ServiceTagScan', ServiceTagScan);
});
