//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('CarapaceRouter')

//@Require('Backbone')
//@Require('Class')
//@Require('List')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CarapaceRouter = Class.adapt(Backbone.Router, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(options) {

        this._super(options);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.currentFragment = null;

        /**
         * @private
         * @type {string}
         */
        this.previousFragment = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getCurrentFragment: function() {
        return this.currentFragment;
    },

    /**
     * @return {string}
     */
    getPreviousFragment: function() {
        return this.previousFragment;
    },


    //-------------------------------------------------------------------------------
    // Backbone.Router Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Object} options
     */
    initialize: function(options) {
        this._super(options);
        this.bind("beforeRoute", this.handleBeforeRoute, this);
    },

    /**
     * @param {string} route
     * @param {string} name
     * @param {function()} callback
     */
    route: function(route, name, callback) {
        var _this = this;
        this._super(route, name, function() {
            _this.trigger("beforeRoute");
            callback.apply(_this, arguments)
        });
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    /*navigatePrevious: function(options) {
        if (this.currentPreviousFragment === null) {
            if (this.historyList.getCount() > 1) {
                this.currentPreviousFragment = this.historyList.getAt(this.historyList.getCount() - 2);
                this.navigate(this.currentPreviousFragment, options);
            }
        } else {
            var index = this.historyList.indexOf(this.currentPreviousFragment);
            if (index > 0) {
                this.currentPreviousFragment = this.historyList.getAt(index - 1);
                this.navigate(this.currentPreviousFragment, options);
            }
        }
    },*/


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    storeRoute: function() {
        this.previousFragment = this.currentFragment;
        this.currentFragment = Backbone.history.fragment;
        //this.historyList.add(Backbone.history.fragment);
    },


    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    handleBeforeRoute: function() {
        this.storeRoute();
    }
});
