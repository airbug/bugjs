/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugioc may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.BugIoc')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('Proxy')
//@Require('bugioc.AutowiredTagProcessor')
//@Require('bugioc.AutowiredTagScan')
//@Require('bugioc.ContextCommandFactory')
//@Require('bugioc.IocContext')
//@Require('bugioc.ModuleTagProcessor')
//@Require('bugioc.ModuleTagScan')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Map                 = bugpack.require('Map');
    var Obj                 = bugpack.require('Obj');
    var Proxy               = bugpack.require('Proxy');
    var AutowiredTagProcessor   = bugpack.require('bugioc.AutowiredTagProcessor');
    var AutowiredTagScan        = bugpack.require('bugioc.AutowiredTagScan');
    var ContextCommandFactory   = bugpack.require('bugioc.ContextCommandFactory');
    var IocContext          = bugpack.require('bugioc.IocContext');
    var ModuleTagProcessor  = bugpack.require('bugioc.ModuleTagProcessor');
    var ModuleTagScan       = bugpack.require('bugioc.ModuleTagScan');

    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var BugIoc = Class.extend(Obj, {

        _name: "bugioc.BugIoc",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Public Properties
            //-------------------------------------------------------------------------------

            /**
             * @type {function(new:ModuleTagProcessor)}
             */
            this.ModuleTagProcessor     = ModuleTagProcessor;

            /**
             * @type {function(new:ModuleTagScan)}
             */
            this.ModuleTagScan          = ModuleTagScan;


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<MetaContext, AutowiredTagScan>}
             */
            this.autowiredTagScanMap    = new Map();

            /**
             * @private
             * @type {IocContext}
             */
            this.iocContext             = null;

            /**
             * @private
             * @type {Map.<MetaContext, ModuleTagScan>}
             */
            this.moduleTagScanMap       = new Map();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {MetaContext} metaContext
         * @return {AutowiredTagScan}
         */
        autowiredScan: function(metaContext) {
            var autowiredTagScan = this.autowiredTagScanMap.get(metaContext);
            if (!autowiredTagScan) {
                autowiredTagScan = new AutowiredTagScan(metaContext, new AutowiredTagProcessor(this.context()));
                this.autowiredTagScanMap.put(metaContext, autowiredTagScan);
            }
            return autowiredTagScan;
        },

        /**
         * @return {IocContext}
         */
        context: function() {
            if (!this.iocContext) {
                this.iocContext = new IocContext(new ContextCommandFactory());
            }
            return this.iocContext;
        },

        /**
         * @param {MetaContext} metaContext
         * @return {ModuleTagScan}
         */
        moduleScan: function(metaContext) {
            var moduleTagScan = this.moduleTagScanMap.get(metaContext);
            if (!moduleTagScan) {
                moduleTagScan = new ModuleTagScan(metaContext, new ModuleTagProcessor(this.context()));
                this.moduleTagScanMap.put(metaContext, moduleTagScan);
            }
            return moduleTagScan;
        }
    });


    //-------------------------------------------------------------------------------
    // Private Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @private
     * @type {BugIoc}
     */
    BugIoc.instance = null;


    //-------------------------------------------------------------------------------
    // Public Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @return {BugIoc}
     */
    BugIoc.getInstance = function() {
        if (BugIoc.instance === null) {
            BugIoc.instance = new BugIoc();
        }
        return BugIoc.instance;
    };


    //-------------------------------------------------------------------------------
    // Static Proxy
    //-------------------------------------------------------------------------------

    Proxy.proxy(BugIoc, Proxy.method(BugIoc.getInstance), [,
        "autowiredScan",
        "context",
        "moduleScan"
    ]);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.BugIoc', BugIoc);
});
