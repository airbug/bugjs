//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.ViewBuilder')

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

    var Class               = bugpack.require('Class');
    var List                = bugpack.require('List');
    var Obj                 = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ViewBuilder = Class.extend(Obj, {

        _name: "carapace.ViewBuilder",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(new:CarapaceView)} viewConstructor
         * @private
         */
        _constructor: function(viewConstructor) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.viewAppendTo           = null;

            /**
             * @private
             * @type {Object}
             */
            this.viewAttributes         = {};

            /**
             * @private
             * @type {List.<ViewBuilder>}
             */
            this.viewChildren           = new List();

            /**
             * @private
             * @type {function(new:CarapaceView)}
             */
            this.viewConstructor        = viewConstructor;

            /**
             * @private
             * @type {string}
             */
            this.viewId                 = null;

            /**
             * @private
             * @type {CarapaceModel}
             */
            this.viewModel              = null;

            /**
             * @private
             * @type {string}
             */
            this.viewName               = null;
        },


        //-------------------------------------------------------------------------------
        // Public Class Methods
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
         * @param {CarapaceContainer=} container
         * @return {CarapaceView}
         */
        build: function(container) {
            var viewOptions     = this.generateViewOptions();
            /** @type {CarapaceView} */
            var view            = new this.viewConstructor(viewOptions);
            if (this.viewName && !!container) {
                container[this.viewName] = view;
            }
            this.viewChildren.forEach(function(viewChildBuilder) {
                var viewChild = viewChildBuilder.build(container);
                view.addViewChild(viewChild, viewChildBuilder.viewAppendTo);
            });
            return view;
        },

        /**
         * @param {Array<CarapaceView>} viewChildren
         * @return {ViewBuilder}
         */
        children: function(viewChildren) {
            this.viewChildren.addAll(viewChildren);
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

        /**
         * @param {string} viewName
         */
        name: function(viewName) {
            this.viewName = viewName;
            return this;
        },


        //-------------------------------------------------------------------------------
        // Private Class Methods
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
            if (this.viewName) {
                viewOptions.name = this.viewName;
            }
            return viewOptions;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(new:CarapaceView)} viewConstructor
     * @return {ViewBuilder}
     */
    ViewBuilder.view = function(viewConstructor) {
        return new ViewBuilder(viewConstructor);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('carapace.ViewBuilder', ViewBuilder);
});
