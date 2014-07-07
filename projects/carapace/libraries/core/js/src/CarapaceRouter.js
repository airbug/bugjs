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

//@Export('carapace.CarapaceRouter')
//@Autoload

//@Require('Class')
//@Require('List')
//@Require('backbone.Backbone')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var List        = bugpack.require('List');
    var Backbone    = bugpack.require('backbone.Backbone');
    var ArgTag      = bugpack.require('bugioc.ArgTag');
    var ModuleTag   = bugpack.require('bugioc.ModuleTag');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg         = ArgTag.arg;
    var bugmeta     = BugMeta.context();
    var module      = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     */
    var CarapaceRouter = Class.adapt(Backbone.Router, {

        _name: "carapace.CarapaceRouter",


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
             * @type {string}
             */
            this.currentFragment = null;

            /**
             * @private
             * @type {string}
             */
            this.previousFragment = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getCurrentFragment: function() {
            return this.currentFragment;
        },

        /**
         * @return {string}
         */
        getPreviousFragment: function() {
            return this.previousFragment;
        },


        //-------------------------------------------------------------------------------
        // Backbone.Router Extensions
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Object} options
         */
        initialize: function(options) {
            this._super(options);
            this.bind("beforeRoute", this.handleBeforeRoute, this);
        },

        /**
         * @param {string} route
         * @param {string} name
         * @param {function()} callback
         */
        route: function(route, name, callback) {
            var _this = this;
            this._super(route, name, function() {
                _this.trigger("beforeRoute");
                callback.apply(_this, arguments)
            });
        },


        //-------------------------------------------------------------------------------
        // Public Class Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        /*navigatePrevious: function(options) {
            if (this.currentPreviousFragment === null) {
                if (this.historyList.getCount() > 1) {
                    this.currentPreviousFragment = this.historyList.getAt(this.historyList.getCount() - 2);
                    this.navigate(this.currentPreviousFragment, options);
                }
            } else {
                var index = this.historyList.indexOf(this.currentPreviousFragment);
                if (index > 0) {
                    this.currentPreviousFragment = this.historyList.getAt(index - 1);
                    this.navigate(this.currentPreviousFragment, options);
                }
            }
        },*/


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        storeRoute: function() {
            this.previousFragment = this.currentFragment;
            this.currentFragment = Backbone.history.fragment;
            //this.historyList.add(Backbone.history.fragment);
        },


        //-------------------------------------------------------------------------------
        // Event Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        handleBeforeRoute: function() {
            this.storeRoute();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CarapaceRouter).with(
        module("carapaceRouter")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('carapace.CarapaceRouter', CarapaceRouter);
});
