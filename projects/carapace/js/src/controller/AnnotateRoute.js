//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('AnnotateRoute')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AnnotateRoute = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(route) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(...*)}
         */
        this.method = null;

        /**
         * @private
         * @type {string}
         */
        this.route = route;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {function(...*)}
     */
    getMethod: function() {
        return this.method;
    },

    /**
     *
     * @return {string}
     */
    getRoute: function() {
        return this.route;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {function(...*)}
     */
    to: function(method) {
        this.method = method;

        // NOTE BRN: Return a reference to "this" so that this function can be used inline

        return this;
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {string} route
 * @return {AnnotateRoute}
 */
AnnotateRoute.route = function(route) {
    return new AnnotateRoute(route);
};
