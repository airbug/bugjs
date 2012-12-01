//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('CarapaceContainer')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('CarapaceContainer');

var Class = bugpack.require('Class');
var List = bugpack.require('List');
var Map = bugpack.require('Map');
var Obj = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CarapaceContainer = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.activated = false;

        /**
         * @private
         * @type {Map<string, CarapaceCollection>}
         */
        this.collectionMap = new Map();

        /**
         * @private
         * @type {List<CarapaceContainer>}
         */
        this.containerChildList = new List();

        /**
         * @private
         * @type {*}
         */
        this.containerParent = null;

        /**
         * @private
         * @type {boolean}
         */
        this.created = false;

        /**
         * @private
         * @type {Map<CarapaceModel>}
         */
        this.modelMap = new Map();

        /**
         * @private
         * @type {CarapaceView}
         */
        this.viewTop = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CarapaceContainer}
     */
    getContainerParent: function() {
        return this.containerParent;
    },

    /**
     * @return {CarapaceView}
     */
    getViewTop: function() {
        return this.viewTop;
    },

    /**
     * @param {CarapaceView} view
     */
    setViewTop: function(view) {
        this.viewTop = view;
    },

    /**
     * @return {boolean}
     */
    isActivated: function() {
        return this.activated;
    },

    /**
     * @return {boolean}
     */
    isCreated: function() {
        return this.created;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    // Container Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<*>} routingArgs
     */
    activate: function(routingArgs) {
        if (!this.activated) {
            this.activated = true;
            this.activateContainer(routingArgs);
            this.activateContainerChildren(routingArgs);
        }
    },

    /**
     *
     */
    create: function() {
        if (!this.created) {
            this.created = true;
            this.createContainer();
            this.createContainerChildren();
            this.initializeContainer();
        }
    },

    recreateChildren: function() {
        // TODO BRN: If we end up needing this hook, the first step we will want to take is to disconnect our viewTop.el
        // from the dom so that we don't cause more than one redraw/repaint.
    },

    /**
     *
     */
    deactivate: function() {
        if (this.activated) {
            this.activated = false;
            this.deactivateContainer();
            this.deactivateContainerChildren();
        }
    },

    /**
     *
     */
    destroy: function() {
        if (this.created) {
            this.created = false;
            this.deinitializeContainer();
            this.destroyContainerChildren();
            this.destroyContainer();
        }
    },


    // Container Children Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {CarapaceContainer} containerChild
     * @param {?string=} domQuery
     */
    addContainerChild: function(containerChild, domQuery) {
        if (!this.isCreated()) {
            this.create();
        }
        if (!containerChild.isCreated()) {
            containerChild.create();
        }

        // NOTE BRN: If this container child already has a parent, then remove it from that parent before adding it
        // to this one.

        if (containerChild.getContainerParent() !== null) {
            containerChild.getContainerParent().removeContainerChild(containerChild);
        }
        this.containerChildList.add(containerChild);
        containerChild.containerParent = this;

        this.viewTop.addViewChild(containerChild.getViewTop(), domQuery);

        if (this.isActivated()) {
            //TODO BRN: Should we pass in the routingArgs here? How do we get a reference to those?
            containerChild.activate([]);
        }
    },

    /**
     * @param {CarapaceContainer} containerChild
     * @return {boolean}
     */
    hasContainerChild: function(containerChild) {
        return this.containerChildList.contains(containerChild);
    },

    /**
     * @param {CarapaceContainer} containerChild
     */
    removeContainerChild: function(containerChild) {
        if (this.hasContainerChild(containerChild)) {
            this.containerChildList.remove(containerChild);
            containerChild.containerParent = null;
        }
    },


    // Collection Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {CarapaceCollection} collection
     */
    addCollection: function(collection) {
        var collectionId = collection.getId();
        if (!collectionId) {
            throw new Error("Collection id must be defined!");
        }
        if (this.collectionMap.containsKey(collectionId)) {
            throw new Error("A collection is already present for this id: " + collectionId);
        }
        this.collectionMap.put(collectionId, collection);
    },

    /**
     * @protected
     * @param {string} collectionId
     * @return {CarapaceCollection}
     */
    getCollection: function(collectionId) {
        return this.collectionMap.get(collectionId);
    },

    /**
     * @protected
     * @param {string} collectionId
     */
    removeCollection: function(collectionId) {
        if (this.collectionMap.containsKey(collectionId)) {
            this.collectionMap.remove(collectionId);
        }
    },


    // Model Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {CarapaceModel} model
     */
    addModel: function(model) {
        var modelId = model.getId();
        if (!modelId) {
            throw new Error("Model id must be defined!");
        }
        if (this.modelMap.containsKey(modelId)) {
            throw new Error("A model is already present for this id: " + modelId);
        }
        this.modelMap.put(modelId, model);
    },

    /**
     * @protected
     * @param {string} modelId
     * @return {CarapaceModel}
     */
    getModel: function(modelId) {
        return this.modelMap.get(modelId);
    },

    /**
     * @protected
     * @param {string} modelId
     */
    removeModel: function(modelId) {
        if (this.modelMap.containsKey(modelId)) {
            this.modelMap.remove(modelId);
        }
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    // Container Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routingArgs
     */
    activateContainer: function(routingArgs) {

    },

    /**
     * @protected
     * @param {Array<*>} routingArgs
     */
    activateContainerChildren: function(routingArgs) {
        this.containerChildList.forEach(function(containerChild) {
            containerChild.activate(routingArgs);
        });
    },

    /**
     * @protected
     */
    createContainer: function() {

    },

    /**
     * @protected
     */
    createContainerChildren: function() {

    },

    /**
     * @protected
     */
    deactivateContainer: function() {

    },

    /**
     * @protected
     */
    deactivateContainerChildren: function() {
        this.containerChildList.forEach(function(containerChild) {
            containerChild.deactivate();
        });
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {

    },

    /**
     * @proetected
     */
    destroyContainer: function() {
        var _this = this;
        this.viewTop.dispose();
        this.viewTop = null;
        this.collectionMap.forEach(function(collection) {
            _this.removeCollection(collection.getId());
            collection.dispose();
        });
        this.modelMap.forEach(function(model) {
            _this.removeModel(model.getId());
            model.dispose();
        });
    },

    /**
     * @protected
     */
    destroyContainerChildren: function() {
        var _this = this;
        var containerChildListClone = this.containerChildList.clone();
        containerChildListClone.forEach(function(containerChild) {
            containerChild.destroy();
            _this.removeContainerChild(containerChild);
        });
    },

    /**
     * @protected
     */
    initializeContainer: function() {

    },


    // View Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} id
     * @return {CarapaceView}
     */
    findViewById: function(id) {
        return this.findViewByIdRecursive(this.getViewTop(), id);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CarapaceView} view
     * @param {string} id
     * @return {CarapaceView}
     */
    findViewByIdRecursive: function(view, id) {
        if (view.getId() === id) {
            return view;
        } else {
            for (var i = 0, size = view.getViewChildList().getCount(); i < size; i++) {
                var result = this.findViewByIdRecursive(view.getViewChildList().getAt(i), id);
                if (result !== null) {
                    return result;
                }
            }
        }
        return null;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(CarapaceContainer);
