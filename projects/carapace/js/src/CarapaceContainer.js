//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.CarapaceContainer')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('List')
//@Require('Map')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var EventDispatcher     = bugpack.require('EventDispatcher');
    var List                = bugpack.require('List');
    var Map                 = bugpack.require('Map');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var CarapaceContainer = Class.extend(EventDispatcher, {

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
             * @type {boolean}
             */
            this.activated          = false;

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
        // Public Methods
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
         * @param {?string=} domQuery
         */
        addContainerChildTo: function(containerChild, domQuery) {
            this.addContainerChild(containerChild, domQuery);
        },

        /**
         * @param {CarapaceContainer} containerChild
         * @param {?string=} domQuery
         */
        prependContainerChild: function(containerChild, domQuery) {
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

            this.viewTop.prependViewChildTo(containerChild.getViewTop(), domQuery);

            if (this.isActivated()) {
                //TODO BRN: Should we pass in the routingArgs here? How do we get a reference to those?
                containerChild.activate([]);
            }
        },

        /**
         * @param {CarapaceContainer} containerChild
         * @param {?string=} domQuery
         */
        prependContainerChildTo: function(containerChild, domQuery) {
            this.prependContainerChild(containerChild, domQuery);
        },

    //    BUGBUG
    //    /**
    //     * @param {CarapaceContainer} containerChild
    //     * @param {number} index
    //     * @param {string} domQuery
    //     */
    //    addContainerChildAt: function(containerChild, index, domQuery) {
    //        if (!this.isCreated()) {
    //            this.create();
    //        }
    //        if (!containerChild.isCreated()) {
    //            containerChild.create();
    //        }
    //
    //        // NOTE BRN: If this container child already has a parent, then remove it from that parent before adding it
    //        // to this one.
    //
    //        if (containerChild.getContainerParent() !== null) {
    //            containerChild.getContainerParent().removeContainerChild(containerChild);
    //        }
    //        this.containerChildList.add(containerChild);
    //        containerChild.containerParent = this;
    //
    //        this.viewTop.addViewChildAt(containerChild.getViewTop(), index, domQuery);
    //
    //        if (this.isActivated()) {
    //            //TODO BRN: Should we pass in the routingArgs here? How do we get a reference to those?
    //            containerChild.activate([]);
    //        }
    //    },

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
         * @protected
         */
        destroyContainer: function() {
            this.viewTop.dispose();
            this.viewTop = null;
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
});
