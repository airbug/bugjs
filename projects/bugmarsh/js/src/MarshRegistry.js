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

//@Export('bugmarsh.MarshRegistry')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugioc.IConfiguringModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmarsh.MarshTagProcessor')
//@Require('bugmarsh.MarshTagScan')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug                 = bugpack.require('Bug');
    var Class               = bugpack.require('Class');
    var Map                 = bugpack.require('Map');
    var Obj                 = bugpack.require('Obj');
    var IConfiguringModule  = bugpack.require('bugioc.IConfiguringModule');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var MarshTagProcessor   = bugpack.require('bugmarsh.MarshTagProcessor');
    var MarshTagScan        = bugpack.require('bugmarsh.MarshTagScan');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IConfiguringModule}
     */
    var MarshRegistry = Class.extend(Obj, {

        _name: "bugmarsh.MarshRegistry",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<Class, Marsh>}
             */
            this.classToMarshMap    = new Map();

            /**
             * @private
             * @type {Map.<string, Marsh>}
             */
            this.nameToMarshMap     = new Map();

            /**
             * @private
             * @type {boolean}
             */
            this.configured         = false;
        },


        //-------------------------------------------------------------------------------
        // IConfiguringModule Implementation
        //-------------------------------------------------------------------------------

        /**
         *
         */
        configureModule: function() {
            if (!this.configured) {
                this.configured = true;
                var scan = new MarshTagScan(bugmeta, new MarshTagProcessor(this));
                scan.scanAll();
            } else {
                throw new Bug("IllegalState", {}, "Already configured module MarshRegistry");
            }
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Class} _class
         * @return {Marsh}
         */
        getMarshByClass: function(_class) {
            this.assertConfigured();
            return this.classToMarshMap.get(_class);
        },

        /**
         * @param {string} name
         * @return {Marsh}
         */
        getMarshByName: function(name) {
            this.assertConfigured();
            return this.nameToMarshMap.get(name);
        },

        /**
         * @param {Class} _class
         * @return {boolean}
         */
        hasMarshForClass: function(_class) {
            this.assertConfigured();
            return this.classToMarshMap.containsKey(_class);
        },

        /**
         * @param {string} name
         * @return {boolean}
         */
        hasMarshForName: function(name) {
            this.assertConfigured();
            return this.nameToMarshMap.containsKey(name);
        },

        /**
         * @param {Marsh} marsh
         */
        registerMarsh: function(marsh) {
            this.assertConfigured();
            if (this.hasMarshForClass(marsh.getMarshClass())) {
                throw new Error("Marsh already registered for class - class:", marsh.getMarshClass());
            }
            if (this.hasMarshForName(marsh.getMarshName())) {
                throw new Error("Marsh already registered for entity name - name:", marsh.getMarshName());
            }
            this.classToMarshMap.put(marsh.getMarshClass(), marsh);
            this.nameToMarshMap.put(marsh.getMarshName(), marsh);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        assertConfigured: function() {
            if (!this.configured) {
                throw new Bug("AssertFailed", {}, "Module 'MarshRegistry' has not been configured");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(MarshRegistry, IConfiguringModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MarshRegistry).with(
        module("marshRegistry")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmarsh.MarshRegistry', MarshRegistry);
});
