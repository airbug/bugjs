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

//@Export('bugyarn.LoomContext')

//@Require('Bug')
//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugyarn.Weaver')
//@Require('bugyarn.Winder')
//@Require('bugyarn.Yarn')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug     = bugpack.require('Bug');
    var Class   = bugpack.require('Class');
    var Map     = bugpack.require('Map');
    var Obj     = bugpack.require('Obj');
    var Weaver  = bugpack.require('bugyarn.Weaver');
    var Winder  = bugpack.require('bugyarn.Winder');
    var Yarn    = bugpack.require('bugyarn.Yarn');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var LoomContext = Class.extend(Obj, {

        _name: "bugyarn.LoomContext",


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
             * @type {Map.<string, Weaver>}
             */
            this.weaverMap      = new Map();

            /**
             * @private
             * @type {Map.<string, Winder>}
             */
            this.winderMap      = new Map();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Map.<string, Weaver>}
         */
        getWeaverMap: function() {
            return this.weaverMap;
        },

        /**
         * @return {Map.<string, Winder>}
         */
        getWinderMap: function() {
            return this.winderMap;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} weaverName
         * @return {Weaver}
         */
        getWeaverByName: function(weaverName) {
            return this.weaverMap.get(weaverName);
        },

        /**
         * @param {string} winderName
         * @return {Winder}
         */
        getWinderByName: function(winderName) {
            return this.winderMap.get(winderName);
        },

        /**
         * @param {string} weaverName
         * @param {function(Yarn):*} weaverFunction
         */
        registerWeaver: function(weaverName, weaverFunction) {
            var weaver = new Weaver(weaverName, weaverFunction);
            if (!this.weaverMap.containsKey(weaverName)) {
                this.weaverMap.put(weaverName, weaver);
            } else {
                throw new Bug("IllegalState", {}, "Weaver already registered with the name '" + weaverName + "'");
            }
        },

        /**
         * @param {string} winderName
         * @param {function(Yarn)} winderFunction
         */
        registerWinder: function(winderName, winderFunction) {
            var winder = new Winder(winderName, winderFunction);
            if (!this.winderMap.containsKey(winderName)) {
                this.winderMap.put(winderName, winder);
            } else {
                throw new Bug("IllegalState", {}, "Winder already registered with the name '" + winderName + "'");
            }
        },

        /**
         * @param {Object} yarnContext
         * @return {Yarn}
         */
        yarn: function(yarnContext) {
            return new Yarn(yarnContext, this);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugyarn.LoomContext', LoomContext);
});
