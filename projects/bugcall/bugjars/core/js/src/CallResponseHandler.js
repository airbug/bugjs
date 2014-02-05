//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallResponseHandler')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var CallResponseHandler = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {function(Throwable, CallResponse=)} responseHandlerFunction
     * @param {Object=} responseHandlerContext
     */
    _constructor: function(responseHandlerFunction, responseHandlerContext) {

        this._super();

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Object}
         */
        this.responseHandlerContext     = responseHandlerContext;

        /**
         * @private
         * @type {function(Throwable, CallResponse=)}
         */
        this.responseHandlerFunction    = responseHandlerFunction;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getResponseHandlerContext: function() {
        return this.responseHandlerContext;
    },

    /**
     * @return {function(Throwable, CallResponse=)}
     */
    getResponseHandlerFunction: function() {
        return this.responseHandlerFunction;
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Throwable} throwable
     * @param {CallResponse} callResponse
     */
    handle: function(throwable, callResponse) {
        this.responseHandlerFunction.call(this.responseHandlerContext, throwable, callResponse);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallResponseHandler', CallResponseHandler);
