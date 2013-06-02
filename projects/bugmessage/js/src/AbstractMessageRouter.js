//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmessage')

//@Export('AbstractMessageRouter')

//@Require('Class')
//@Require('List')
//@Require('bugmessage.AbstractMessageReceiver')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var List                    = bugpack.require('List');
var AbstractMessageReceiver = bugpack.require('bugmessage.AbstractMessageReceiver');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AbstractMessageRouter = Class.extend(AbstractMessageReceiver, {


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
         * @type {List.<MessageChannel>}
         */
        this.messageChannelList = new List();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // AbstractMessageReceiver Implementation
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @param {Message} message
     * @param {MessageResponder} messageResponder
     */
    doReceiveMessage: function(message, messageResponder) {
        this.routeMessage(message, messageResponder);
    },


    //-------------------------------------------------------------------------------
    // Abstract Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @param {Message} message
     * @param {MessageResponder} messageResponder
     */
    //routeMessage: function(message, messageResponder) {},


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MessageChannel} messageChannel
     * @return {boolean}
     */
    addMessageChannel: function(messageChannel) {
        if (!this.messageChannelList.contains(messageChannel)) {
            this.messageChannelList.add(messageChannel);
            messageChannel.addEventPropagator(this);
            return true;
        }
        return false;
    },

    /**
     * @return {number}
     */
    getMessageChannelCount: function() {
        return this.messageChannelList.getCount();
    },

    /**
     * @param {MessageChannel} messageChannel
     * @return {boolean}
     */
    hasMessageChannel: function(messageChannel) {
        return this.messageChannelList.contains(messageChannel);
    },

    /**
     * @return {boolean}
     */
    isMessageChannelListEmpty: function() {
        return this.messageChannelList.isEmpty();
    },

    /**
     * @param {MessageChannel} messageChannel
     * @return {boolean}
     */
    removeMessageChannel: function(messageChannel) {
        var result = this.messageChannelList.remove(messageChannel);
        if (result) {
            messageChannel.removeEventPropagator(this);
        }
        return result;
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugmessage.AbstractMessageRouter', AbstractMessageRouter);
