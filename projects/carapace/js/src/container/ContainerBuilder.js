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

//@Export('carapace.ContainerBuilder')

//@Require('Class')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var List    = bugpack.require('List');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ContainerBuilder = Class.extend(Obj, {

        _name: "carapace.ContainerBuilder",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(new:CarapaceContainer)} containerConstructor
         */
        _constructor: function(containerConstructor) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.containerAppendTo      = null;

            /**
             * @private
             * @type {List.<ContainerBuilder>}
             */
            this.containerChildren      = new List();

            /**
             * @private
             * @type {function(new:CarapaceContainer)}
             */
            this.containerConstructor   = containerConstructor;

            this.containerModels = new Map
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} viewAppendTo
         * @return {ViewBuilder}
         */
        appendTo: function(viewAppendTo) {
            this.viewAppendTo = viewAppendTo;
            return this;
        },

        /**
         * @param {Object} viewAttributes
         * @return {ViewBuilder}
         */
        attributes: function(viewAttributes) {
            this.viewAttributes = viewAttributes;
            return this;
        },

        /**
         * @return {CarapaceView}
         */
        build: function() {
            var viewOptions = this.generateViewOptions();
            var view = new this.viewClass(viewOptions);
            this.viewChildren.forEach(function(viewChildBuilder) {
                var viewChild = viewChildBuilder.build();
                view.addViewChild(viewChild, viewChildBuilder.viewAppendTo);
            });
            return view;
        },

        /**
         * @param {Array.<CarapaceView>} viewChildren
         * @return {ViewBuilder}
         */
        children: function(viewChildren) {
            this.viewChildren = viewChildren;
            return this;
        },

        /**
         * @param {string} viewId
         * @return {ViewBuilder}
         */
        id: function(viewId) {
            this.viewId = viewId;
            return this;
        },

        /**
         * @param {CarapaceModel} viewModel
         * @return {ViewBuilder}
         */
        model: function(viewModel) {
            this.viewModel = viewModel;
            return this;
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @return {Object}
         */
        generateViewOptions: function() {
            var viewOptions = {};
            if (this.viewAttributes) {
                viewOptions.attributes = this.viewAttributes;
            }
            if (this.viewId) {
                viewOptions.id = this.viewId;
            }
            if (this.viewModel) {
                viewOptions.model = this.viewModel;
            }
            return viewOptions;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {function(new:CarapaceContainer)} containerConstructor
     * @return {ContainerBuilder}
     */
    ContainerBuilder.container = function(containerConstructor) {
        return new ContainerBuilder(containerConstructor);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('carapace.ContainerBuilder', ContainerBuilder);
});
