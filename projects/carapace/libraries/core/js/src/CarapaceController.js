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

//@Export('carapace.CarapaceController')

//@Require('Class')
//@Require('List')
//@Require('Obj')
//@Require('backbone.Backbone')
//@Require('bugdispose.IDisposable')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ControllerRoute')


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
    var Backbone            = bugpack.require('backbone.Backbone');
    var IDisposable         = bugpack.require('bugdispose.IDisposable');
    var AutowiredTag        = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag         = bugpack.require('bugioc.PropertyTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var ControllerRoute     = bugpack.require('carapace.ControllerRoute');


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
     * @extends {Obj}
     * @implements {IDisposable}
     */
    var CarapaceController = Class.extend(Obj, {

        _name: "carapace.CarapaceController",


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
             * @type {*}
             */
            this.containerTop       = null;

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
             * @type {boolean}
             */
            this.started            = false;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {CarapaceContainer}
         */
        getContainerTop: function() {
            return this.containerTop;
        },

        /**
         * @param {CarapaceContainer} container
         */
        setContainerTop: function(container) {
            this.clearContainerTop();
            if (container) {
                this.containerTop = container;
                this.garbageDisposal.addReference(this, container);
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

        /**
         * @return {boolean}
         */
        isStarted: function() {
            return this.started;
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

        /**
         * @param {Array<*>} routingArgs
         */
        activate: function(routingArgs) {
            if (!this.activated) {
                this.activated = true;
                this.activateController(routingArgs);
            }
        },

        /**
         * @param {Array<*>} routingArgs
         */
        create: function(routingArgs) {
            if (!this.created) {
                this.created = true;
                this.createController();
                this.validateController();
                this.getContainerTop().create(routingArgs);
                this.initializeController();
            }
        },

        /**
         *
         */
        clearContainerTop: function() {
            if (this.containerTop) {
                this.garbageDisposal.removeReference(this, this.containerTop);
                this.containerTop = null;
            }
        },

        /**
         *
         */
        deactivate: function() {
            if (this.activated) {
                this.activated = false;
                this.deactivateController();
            }
        },

        /**
         *
         */
        destroy: function() {
            if (this.created) {
                this.created = false;
                this.deinitializeController();
                this.destroyController();
            }
        },

        /**
         * @param {RoutingRequest} routingRequest
         */
        route: function(routingRequest) {
            this.filterRouting(routingRequest);
        },

        /**
         * @param {Array<*>} routingArgs
         */
        start: function(routingArgs) {
            if (!this.started) {
                this.started = true;
                this.create(routingArgs);
                this.activate(routingArgs);
            }
        },

        /**
         *
         */
        stop: function() {
            if (this.started) {
                this.started = false;
                this.deactivate();
                this.destroy();
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        // Controller Lifecycle Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Array<*>} routingArgs
         */
        activateController: function(routingArgs) {
            this.containerTop.activate(routingArgs);
        },

        /**
         * @protected
         */
        createController: function() {
            this.garbageDisposal.addDisposableRoot(this);
        },

        /**
         * @protected
         */
        deactivateController: function() {
            this.containerTop.deactivate();
        },

        /**
         * @protected
         */
        deinitializeController: function() {

        },

        /**
         * @protected
         */
        destroyController: function() {
            this.containerTop.destroy();
            this.clearContainerTop();
            this.garbageDisposal.removeDisposable(this);
        },

        /**
         * @protected
         */
        initializeController: function() {

        },

        /**
         * @protected
         */
        validateController: function() {
            if (!this.getContainerTop()) {
                throw new Error("Must set container top during container creation.");
            }
        },


        // Route Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        filterRouting: function(routingRequest) {
            routingRequest.accept();
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(CarapaceController, IDisposable);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CarapaceController).with(
        autowired().properties([
            property("garbageDisposal").ref("garbageDisposal")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('carapace.CarapaceController', CarapaceController);
});
