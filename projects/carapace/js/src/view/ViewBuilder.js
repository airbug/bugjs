//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('carapace')

//@Export('ViewBuilder')

//@Require('Class')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var List    = bugpack.require('List');
var Obj     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ViewBuilder = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(viewClass) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.viewAppendTo = null;

        /**
         * @private
         * @type {Object}
         */
        this.viewAttributes = {};

        /**
         * @private
         * @type {List.<ViewBuilder>}
         */
        this.viewChildren = new List();

        /**
         * @private
         * @type {new:CarapaceView}
         */
        this.viewClass = viewClass;

        /**
         * @private
         * @type {CarapaceCollection}
         */
        this.viewCollection = null;

        /**
         * @private
         * @type {string}
         */
        this.viewId = null;

        /**
         * @private
         * @type {CarapaceModel}
         */
        this.viewModel = null;
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
     * @param {Array<CarapaceView>} viewChildren
     * @return {ViewBuilder}
     */
    children: function(viewChildren) {
        this.viewChildren.addAll(viewChildren);
        return this;
    },

    /**
     * @param {CarapaceCollection} viewCollection
     * @return {ViewBuilder}
     */
    collection: function(viewCollection) {
        this.viewCollection = viewCollection;
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
        if (this.viewCollection) {
            viewOptions.collection = this.viewCollection;
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
 * @param {new:CarapaceView} viewClass
 * @return {ViewBuilder}
 */
ViewBuilder.view = function(viewClass) {
    return new ViewBuilder(viewClass);
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('carapace.ViewBuilder', ViewBuilder);
