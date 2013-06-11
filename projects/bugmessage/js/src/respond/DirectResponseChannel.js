//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('DirectResponseChannel')

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
var AbstractResponseChannel  = bugpack.require('bugmessage.AbstractResponseChannel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DirectResponseChannel = Class.extend(AbstractResponseChannel, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {IResponseReceiver}
         */
        this.responseReceiver = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {IResponseReceiver}
     */
    getResponseReceiver: function() {
        return this.responseReceiver;
    },

    /**
     * @param {IResponseReceiver} responseReceiver
     */
    setResponseReceiver: function(responseReceiver) {
        if (this.responseReceiver) {
            this.responseReceiver.removeEventPropagator(this);
        }
        this.responseReceiver = responseReceiver;
        if (this.responseReceiver) {
            this.responseReceiver.addEventPropagator(this);
        }
    },


    //-------------------------------------------------------------------------------
    // AbstractMessageChannel Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Response} response
     */
    doChannelResponse: function(response) {
        this.responseReceiver.receiveResponse(response);
    },

    /**
     *
     */
    doCloseChannel: function() {
        this.responseReceiver.closeReceiver();
        this.setResponseReceiver(null);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugmessage.DirectResponseChannel', DirectResponseChannel);
