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

//@Export('bugioc.AutowiredTagScan')

//@Require('Class')
//@Require('bugioc.AutowiredTag')
//@Require('bugmeta.BugMeta')
//@Require('bugmeta.TagScan')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var AutowiredTag    = bugpack.require('bugioc.AutowiredTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TagScan         = bugpack.require('bugmeta.TagScan');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {TagScan}
     */
    var AutowiredTagScan = Class.extend(TagScan, /** @lends {AutowiredTagScan.prototype} */{

        _name: "bugioc.AutowiredTagScan",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MetaContext} metaContext
         * @param {AutowiredTagProcessor} processor
         */
        _constructor: function(metaContext, processor) {

            this._super(metaContext, processor, AutowiredTag.TYPE);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.scanning       = false;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        scanContinuous: function() {
            var _this = this;
            if (!this.scanning) {
                this.scanning = true;
                var bugmeta                 = BugMeta.context();
                bugmeta.registerTagProcessor("Autowired", function(annotation) {
                    _this.getTagProcessor().process(annotation);
                });
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.AutowiredTagScan', AutowiredTagScan);
});
