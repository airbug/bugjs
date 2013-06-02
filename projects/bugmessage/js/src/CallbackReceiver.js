//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmessage')

//@Export('CallbackReceiver')

//@Require('Class')
//@Require('bugmessage.AbstractMessageReceiver')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var AbstractMessageReceiver = bugpack.require('bugmessage.AbstractMessageReceiver');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CallbackReceiver = Class.extend(AbstractMessageReceiver, {

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
         * @type {function(Message, MessageResponder)}
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
     * @return {function(Message, MessageResponder)}
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
    // AbstractMessageReceiver Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {MessageResponder} messageResponder
     */
    doReceiveMessage: function(message, messageResponder) {
        this.receiverCallback.call(this.receiverContext, message, messageResponder);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugmessage.CallbackReceiver', CallbackReceiver);
