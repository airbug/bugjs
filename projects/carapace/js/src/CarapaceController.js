//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('carapace')

//@Export('CarapaceController')

//@Require('Class')
//@Require('List')
//@Require('Obj')
//@Require('backbone.Backbone')
//@Require('carapace.ControllerRoute')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var List            = bugpack.require('List');
var Obj             = bugpack.require('Obj');
var Backbone        = bugpack.require('backbone.Backbone');
var ControllerRoute = bugpack.require('carapace.ControllerRoute');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CarapaceController = Class.extend(Obj, {

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
        this.activated      = false;

        /**
         * @private
         * @type {*}
         */
        this.containerTop   = null;

        /**
         * @private
         * @type {boolean}
         */
        this.created        = false;

        /**
         * @private
         * @type {boolean}
         */
        this.started        = false;
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
        this.containerTop = container;
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

    /**
     * @return {boolean}
     */
    isStarted: function() {
        return this.started;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routingArgs
     */
    activate: function(routingArgs) {
        if (!this.activated) {
            this.activated = true;
            this.activateController(routingArgs);
        }
    },

    /**
     * @protected
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
     * @protected
     */
    deactivate: function() {
        if (this.activated) {
            this.activated = false;
            this.deactivateController();
        }
    },

    /**
     * @protected
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
    // Protected Class Methods
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
     * @abstract
     * @protected
     */
    createController: function() {

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
        this.containerTop = null;
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
// Exports
//-------------------------------------------------------------------------------

bugpack.export('carapace.CarapaceController', CarapaceController);
