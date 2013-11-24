//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('carapace')

//@Export('CarapaceContainer')

//@Require('Class')
//@Require('List')
//@Require('Map')
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
var Map     = bugpack.require('Map');
var Obj     = bugpack.require('Obj');


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
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.activated          = false;

        /**
         * @private
         * @type {Map.<string, CarapaceCollection>}
         */
        this.collectionMap      = new Map();

        /**
         * @private
         * @type {List.<CarapaceContainer>}
         */
        this.containerChildList = new List();

        /**
         * @private
         * @type {*}
         */
        this.containerParent    = null;

        /**
         * @private
         * @type {boolean}
         */
        this.created            = false;

        /**
         * @private
         * @type {Map.<CarapaceModel>}
         */
        this.modelMap           = new Map();

        /**
         * @private
         * @type {CarapaceView}
         */
        this.viewTop            = null;
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
    create: function(routingArgs) {
        if (!this.created) {
            this.created = true;
            this.createContainer(routingArgs);
            this.createContainerChildren(routingArgs);
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
     * @param {number} index
     * @param {string} domQuery
     */
    addContainerChildAt: function(containerChild, index, domQuery) {
        //TODO
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
     * @param {boolean=} destroy
     */
    removeContainerChild: function(containerChild, destroy) {
        if (this.hasContainerChild(containerChild)) {
            this.containerChildList.remove(containerChild);
            containerChild.containerParent = null;
            if (destroy) {
                containerChild.destroy();
            }
        }
    },

    /**
     *
     */
    removeAllContainerChildren: function(destroy) {
        var _this = this;
        var containerChildListClone = this.containerChildList.clone();
        containerChildListClone.forEach(function(containerChild) {
            _this.removeContainerChild(containerChild, destroy);
        });
    },

    /**
     * @param {number} index
     */
    removeContainerChildAt: function(index) {
        //TODO
    },


    // Collection Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} key
     * @param {CarapaceCollection} collection
     */
    addCollection: function(key, collection) {
        if (!key) {
            throw new Error("key must be defined");
        }
        if (this.collectionMap.containsKey(key)) {
            throw new Error("A collection is already present for this key: " + key);
        }
        this.collectionMap.put(key, collection);
    },

    /**
     * @protected
     * @param {string} key
     * @return {CarapaceCollection}
     */
    getCollection: function(key) {
        return this.collectionMap.get(key);
    },

    /**
     * @protected
     * @param {string} key
     */
    removeCollection: function(key) {
        if (this.collectionMap.containsKey(key)) {
            this.collectionMap.remove(key);
        }
    },


    // Model Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} key
     * @param {CarapaceModel} model
     */
    addModel: function(key, model) {
        if (!key) {
            throw new Error("key must be defined");
        }
        if (this.modelMap.containsKey(key)) {
            throw new Error("A model is already present for this key: " + key);
        }
        this.modelMap.put(key, model);
    },

    /**
     * @protected
     * @param {string} key
     * @return {CarapaceModel}
     */
    getModel: function(key) {
        return this.modelMap.get(key);
    },

    /**
     * @protected
     * @param {string} key
     */
    removeModel: function(key) {
        if (this.modelMap.containsKey(key)) {
            this.modelMap.remove(key);
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
     * @param {Array<*>} routingArgs
     */
    createContainer: function(routingArgs) {

    },

    /**
     * @protected
     * @param {Array<*>} routingArgs
     */
    createContainerChildren: function(routingArgs) {

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
        this.collectionMap.getKeyArray().forEach(function(key) {
            var collection = _this.collectionMap.get(key);
            if(collection){
                _this.removeCollection(key);
                collection.dispose();
            }
        });
        this.modelMap.getKeyArray().forEach(function(key) {
            var model = _this.modelMap.get(key);
            _this.removeModel(key);
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
            _this.removeContainerChild(containerChild, true);
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

bugpack.export('carapace.CarapaceContainer', CarapaceContainer);
