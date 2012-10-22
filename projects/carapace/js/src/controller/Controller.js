//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('Controller')

//@Require('Annotate')
//@Require('Backbone')
//@Require('Class')
//@Require('ControllerRoute')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('List')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Controller = Class.extend(EventDispatcher, {

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
         * @type {List<Model>}
         */
        this.modelList = new List();

        /**
         * @private
         * @type {Backbone.Router}
         */
        this.router = router;

        /**
         * @private
         * @type {List<View>}
         */
        this.viewList = new List();
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(...*)} method
     * @param {Array<*>} args
     */
    processRoute: function(method, args) {
        this.dispatchEvent(new Event(Controller.EventTypes.ACTIVATE_CONTROLLER, this));
        this.activate();
        method.apply(this, args);
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    activate: function() {
        this.activated = true;
    },

    /**
     * @private
     * @param {Model} model
     */
    addModel: function(model) {
        this.modelList.add(model);
    },

    /**
     * @private
     * @param {View} view
     */
    addView: function(view) {
        this.viewList.add(view);
        view.create();
        $('body').append(view.el);
    },

    /**
     * @protected
     */
    deactivate: function() {
        this.activated = false;
        this.viewList.forEach(function(view) {
            view.destroy();
        });
        this.viewList.clear();
    },

    /**
     * @protected
     * @param {string} fragment
     * @param {Object} options
     */
    navigate: function(fragment, options) {
        this.router.navigate(fragment, options);
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
Controller.EventTypes = {
    ACTIVATE_CONTROLLER: "Controller:ActivateController"
};
