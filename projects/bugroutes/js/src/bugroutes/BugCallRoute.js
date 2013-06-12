//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroutes')

//@Export('BugCallRoute')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugCallRoute = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(requestType, listener){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(...)}
         */
        this.listener = listener;

        /**
         * @private
         * @type {string}
         */
        this.requestType = requestType;
    },

    /**
     * @param {CallRequest} request
     * @param {CallReponder} responder
     */
    fire: function(request, responder) {
        this.listener(request, responder);
    },

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {function(...)}
     */
    getListener: function() {
        return this.listener;
    },

    /**
     * @return {string}
     */
    getRequestType: function() {
        return this.requestType;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugroutes.BugCallRoute', BugCallRoute);
