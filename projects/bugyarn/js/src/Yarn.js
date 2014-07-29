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

//@Export('bugyarn.Yarn')

//@Require('ArgumentBug')
//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('ObjectUtil')
//@Require('Set')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgumentBug     = bugpack.require('ArgumentBug');
    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var ObjectUtil      = bugpack.require('ObjectUtil');
    var Set             = bugpack.require('Set');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Yarn = Class.extend(Obj, {

        _name: "bugyarn.Yarn",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} yarnContext
         * @param {LoomContext} loomContext
         */
        _constructor: function(yarnContext, loomContext) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {LoomContext}
             */
            this.loomContext        = loomContext;

            /**
             * @private
             * @type {Set.<string>}
             */
            this.spunSet            = new Set();

            /**
             * @private
             * @type {Object}
             */
            this.yarnContext        = yarnContext;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {LoomContext}
         */
        getLoomContext: function() {
            return this.loomContext;
        },

        /**
         * @return {Object}
         */
        getYarnContext: function() {
            return this.yarnContext;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} yarnName
         * @return {*}
         */
        get: function(yarnName) {
            return this.yarnContext[yarnName];
        },

        /**
         * @param {(string | Array.<string>)} winderNames
         */
        spin: function(winderNames) {
            var _this = this;
            if (TypeUtil.isString(winderNames)) {
                winderNames = [winderNames];
            }
            if (!TypeUtil.isArray(winderNames)) {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "winderNames", winderNames, "parameter must either be either a string or an array of strings");
            }
            winderNames.forEach(function(winderName) {
                if (!_this.spunSet.contains(winderName)) {
                    /** @type {Winder} */
                    var winder = _this.loomContext.getWinderByName(winderName);
                    if (!winder) {
                        throw new Bug("NoWinder", {}, "Cannot find Winder by the name '" + winderName + "'");
                    }
                    _this.spunSet.add(winderName);
                    winder.runWinder(_this);
                }
            });
        },

        /**
         * @param {string} weaverName
         * @param {Array.<*>=} args
         * @return {*}
         */
        weave: function(weaverName, args) {
            if (!TypeUtil.isString(weaverName)) {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "weaverName", weaverName, "parameter must either be a string");
            }
            /** @type {Weaver} */
            var weaver = this.loomContext.getWeaverByName(weaverName);
            if (!weaver) {
                throw new Bug("NoWeaver", {}, "Cannot find Weaver by the name '" + weaverName + "'");
            }
            return weaver.runWeaver(this, args);
        },

        /**
         * @param {Object} windObject
         */
        wind: function(windObject) {
            var _this = this;
            ObjectUtil.forIn(windObject, function(yarnName, yarnValue) {
                if (!ObjectUtil.hasProperty(_this.yarnContext, yarnName)) {
                    _this.yarnContext[yarnName] = yarnValue;
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugyarn.Yarn', Yarn);
});
