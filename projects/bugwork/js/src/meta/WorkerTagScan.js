//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugwork.WorkerTagScan')

//@Require('Class')
//@Require('Obj')
//@Require('bugmeta.TagScan')
//@Require('bugwork.WorkerTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Obj                         = bugpack.require('Obj');
    var TagScan              = bugpack.require('bugmeta.TagScan');
    var WorkerTag            = bugpack.require('bugwork.WorkerTag');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {TagScan}
     */
    var WorkerTagScan = Class.extend(TagScan, {

        _name: "bugwork.WorkerTagScan",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MetaContext} metaContext
         * @param {TagProcessor} processor
         */
        _constructor: function(metaContext, processor) {
            this._super(metaContext, processor, WorkerTag.TYPE);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugwork.WorkerTagScan', WorkerTagScan);
});
