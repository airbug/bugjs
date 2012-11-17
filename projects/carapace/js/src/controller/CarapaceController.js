//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('CarapaceController')

//@Require('Backbone')
//@Require('Class')
//@Require('ControllerRoute')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('List')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CarapaceController = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(router) {

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
        this.apiPublisher = new Publisher();

        /**
         * @private
         * @type {*}
         */
        this.containerTop = null;

        /**
         * @private
         * @type {boolean}
         */
        this.created = false;

        /**
         * @private
         * @type {CarapaceRouter}
         */
        this.router = router;

        /**
         * @private
         * @type {boolean}
         */
        this.started = false;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Publisher}
     */
    getApiPublisher: function() {
        return this.publisher;
    },

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
     */
    activate: function(routerArgs) {
        if (!this.activated) {
            this.activated = true;
            this.activateController(routerArgs);
        }
    },

    /**
     * @protected
     */
    create: function() {
        if (!this.created) {
            this.created = true;
            this.createController();
            this.validateController();
            this.getContainerTop().create();
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
     * @param {Array<*>} routerArgs
     */
    processRoute: function(routerArgs) {
        this.dispatchEvent(new Event(CarapaceController.EventTypes.ACTIVATE_CONTROLLER, this));
        this.start(routerArgs);
    },

    /**
     * @param {Array<*>} routerArgs
     */
    start: function(routerArgs) {
        if (!this.started) {
            this.started = true;
            this.create();
            this.activate(routerArgs);
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

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateController: function(routerArgs) {
        this.containerTop.activate(routerArgs);
    },

    /**
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
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
CarapaceController.EventTypes = {
    ACTIVATE_CONTROLLER: "CarapaceController:ActivateController"
};
