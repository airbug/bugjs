//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmessage')

//@Export('CallbackResponseChannel')

//@Require('Class')
//@Require('bugmessage.AbstractResponseChannel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var AbstractResponseChannel = bugpack.require('bugmessage.AbstractResponseChannel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CallbackResponseChannel = Class.extend(AbstractResponseChannel, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(receiverCallback, receiverContext) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(Response)}
         */
        this.receiverCallback = receiverCallback;

        /**
         * @private
         * @type {Object}
         */
        this.receiverContext = receiverContext;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {function(Response)}
     */
    getReceiverCallback: function() {
        return this.receiverCallback;
    },

    /**
     * @return {Object}
     */
    getReceiverContext: function() {
        return this.receiverContext;
    },


    //-------------------------------------------------------------------------------
    // AbstractResponseReceiver Implementation
    //-------------------------------------------------------------------------------

    /**
     *
     */
    doCloseReceiver: function() {
        this.receiverContext = null;
        this.receiverCallback = null;
    },

    /**
     * @param {Response} response
     */
    doReceiveResponse: function(response) {
        this.receiverCallback.call(this.receiverContext, response);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugmessage.CallbackResponseChannel', CallbackResponseChannel);
