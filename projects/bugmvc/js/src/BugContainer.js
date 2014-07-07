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

//@Export('bugmvc.BugContainer')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('List')
//@Require('Map')
//@Require('Set')
//@Require('bugdispose.IDisposable')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')


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
    var Set                 = bugpack.require('Set');
    var IDisposable         = bugpack.require('bugdispose.IDisposable');
    var AutowiredTag        = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag         = bugpack.require('bugioc.PropertyTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired           = AutowiredTag.autowired;
    var bugmeta             = BugMeta.context();
    var property            = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     * @implements {IDisposable}
     */
    var BugContainer = Class.extend(EventDispatcher, {

        _name: "bugmvc.BugContainer",


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
             * @type {List.<BugContainer>}
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
             * @type {GarbageDisposal}
             */
            this.garbageDisposal    = null;

            /**
             * @private
             * @type {Set.<BugModel>}
             */
            this.modelSet           = new Set();

            /**
             * @private
             * @type {BugView}
             */
            this.viewTop            = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {BugContainer}
         */
        getContainerParent: function() {
            return this.containerParent;
        },

        /**
         * @return {BugView}
         */
        getViewTop: function() {
            return this.viewTop;
        },

        /**
         * @param {BugView} view
         */
        setViewTop: function(view) {
            this.clearViewTop();
            if (view) {
                this.viewTop = view;
                this.garbageDisposal.addReference(this, view);
            }
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

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
        // IDisposable Implementation
        //-------------------------------------------------------------------------------

        /**
         *
         */
        dispose: function() {
            this.destroy();
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

        /**
         *
         */
        clearViewTop: function() {
            if (this.viewTop) {
                this.garbageDisposal.removeReference(this, this.viewTop);
                this.viewTop = null;
            }
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


        // Model Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {BugModel} model
         */
        addModel: function(model) {
            var result = this.modelSet.add(model);
            if (result) {
                if (!model.isCreated()) {
                    model.create();
                }
                this.garbageDisposal.addReference(this, model);
            }
        },

        /**
         * @param {boolean=} destroy
         */
        removeAllModels: function(destroy) {
            var _this       = this;
            var modelSet    = this.modelSet.clone();
            modelSet.forEach(function(model) {
                _this.removeModel(model, destroy);
            });
        },

        /**
         * @param {BugModel} model
         * @param {boolean=} destroy
         */
        removeModel: function(model, destroy) {
            var result = this.modelSet.remove(model);
            if (result) {
                if (destroy) {
                    model.destroy();
                }
                this.garbageDisposal.removeReference(this, model);
            }
        },


        // Container Children Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {BugContainer} containerChild
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
            this.garbageDisposal.addReference(this, containerChild);

            this.viewTop.addViewChild(containerChild.getViewTop(), domQuery);

            if (this.isActivated()) {
                //TODO BRN: Should we pass in the routingArgs here? How do we get a reference to those?
                containerChild.activate([]);
            }
        },

        /**
         * @param {BugContainer} containerChild
         * @param {?string=} domQuery
         */
        addContainerChildTo: function(containerChild, domQuery) {
            this.addContainerChild(containerChild, domQuery);
        },

        /**
         * @param {BugContainer} containerChild
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
            this.garbageDisposal.addReference(this, containerChild);

            this.viewTop.prependViewChildTo(containerChild.getViewTop(), domQuery);

            if (this.isActivated()) {
                //TODO BRN: Should we pass in the routingArgs here? How do we get a reference to those?
                containerChild.activate([]);
            }
        },

        /**
         * @param {BugContainer} containerChild
         * @param {?string=} domQuery
         */
        prependContainerChildTo: function(containerChild, domQuery) {
            this.prependContainerChild(containerChild, domQuery);
        },

        //    BUGBUG
        //    /**
        //     * @param {BugContainer} containerChild
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
         * @param {BugContainer} containerChild
         * @return {boolean}
         */
        hasContainerChild: function(containerChild) {
            return this.containerChildList.contains(containerChild);
        },

        /**
         * @param {BugContainer} containerChild
         * @param {boolean=} destroy
         */
        removeContainerChild: function(containerChild, destroy) {
            if (this.hasContainerChild(containerChild)) {
                this.containerChildList.remove(containerChild);
                containerChild.containerParent = null;
                this.garbageDisposal.removeReference(this, containerChild);
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


        // Helper Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        forceReflow: function() {
            var viewTop = this.getViewTop();
            if (viewTop) {
                viewTop.forceReflow();
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
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
            this.garbageDisposal.addDisposable(this);
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
            this.viewTop.destroy();
            this.clearViewTop();

            //NOTE BRN: Models can cross containers so we don't destroy them here

            this.removeAllModels(false);
            this.garbageDisposal.removeDisposable(this);
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
         * @return {BugView}
         */
        findViewById: function(id) {
            return this.findViewByIdRecursive(this.getViewTop(), id);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {BugView} view
         * @param {string} id
         * @return {BugView}
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
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(BugContainer, IDisposable);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(BugContainer).with(
        autowired().properties([
            property("garbageDisposal").ref("garbageDisposal")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmvc.BugContainer', BugContainer);
});
