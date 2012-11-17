//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ControllerRoute')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ControllerRoute = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(route, controller) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CarapaceController}
         */
        this.controller = controller;

        /**
         * @private
         * @type {boolean}
         */
        this.initialized = false;

        /**
         * @private
         * @type {string}
         */
        this.route = route;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {CarapaceRouter} router
     */
    initialize: function(router) {
        if (!this.initialized) {
            this.initialized = true;
            var name = "ControllerRouter" + this.getInternalId();
            var _this = this;
            router.route(this.route, name, function() {
                _this.controller.processRoute(arguments);
            });
        }
    }
});
