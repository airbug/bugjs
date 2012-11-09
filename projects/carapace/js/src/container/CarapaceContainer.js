//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('CarapaceContainer')

//@Require('Class')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CarapaceContainer = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(apiPublisher) {

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
         * @type {Publisher}
         */
        this.apiPublisher = apiPublisher;

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
         * @type {List<CarapaceModel>}
         */
        this.modelList = new List();

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
     * @param {Array<*>} routerArgs
     */
    activate: function(routerArgs) {
        if (!this.activated) {
            this.activated = true;
            this.activateContainer(routerArgs);
            this.activateContainerChildren(routerArgs);
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
            //TODO BRN: Should we pass in the routerArgs here? How do we get a reference to those?
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


    // Model Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {CarapaceModel} model
     */
    addModel: function(model) {
        this.modelList.add(model);
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    // Container Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {

    },

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainerChildren: function(routerArgs) {
        this.containerChildList.forEach(function(containerChild) {
            containerChild.activate(routerArgs);
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
        this.viewTop.dispose();
        this.viewTop = null;
        this.modelList.forEach(function(model) {
            model.dispose();
        });
        this.modelList.clear();
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

    }
});
