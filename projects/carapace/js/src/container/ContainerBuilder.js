//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('carapace')

//@Export('ContainerBuilder')

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

var ContainerBuilder = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(containerClass) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.containerAppendTo = null;

        /**
         * @private
         * @type {List.<ContainerBuilder>}
         */
        this.containerChildren = new List();

        /**
         * @private
         * @type {new:CarapaceContainer}
         */
        this.containerClass = containerClass;

        this.containerModels = new Map
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
        this.viewChildren = viewChildren;
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
 * @param {new:CarapaceContainer} containerClass
 * @return {ContainerBuilder}
 */
ContainerBuilder.view = function(containerClass) {
    return new ContainerBuilder(viewClass);
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('carapace.ContainerBuilder', ContainerBuilder);
