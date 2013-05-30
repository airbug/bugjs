//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MessageBroadcaster')

//@Require('Class')
//@Require('IMessagePropagator')
//@Require('List')
//@Require('MessagePropagator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IMessagePropagator  = bugpack.require('IMessagePropagator');
var List                = bugpack.require('List');
var MessagePropagator   = bugpack.require('MessagePropagator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageBroadcaster = Class.extend(MessagePropagator, {

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
         * @type {List.<MessagePropagator>}
         */
        this.messagePropagatorList = new List();
    },


    //-------------------------------------------------------------------------------
    // IMessagePropagator Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {string} channel
     */
    propagateMessage: function(message, channel) {
        var messagePropagatorListClone = this.messagePropagatorList.clone();
        messagePropagatorListClone.forEach(function(messagePropagator) {
            messagePropagator.propagateMessage(message, channel);
        });
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MessagePropagator} messagePropagator
     * @return {boolean}
     */
    addMessagePropagator: function(messagePropagator) {
        if (!this.messagePropagatorList.contains(messagePropagator)) {
            this.messagePropagatorList.add(messagePropagator);
            messagePropagator.addEventPropagator(this);
            return true;
        }
        return false;
    },

    /**
     * @return {number}
     */
    getMessagePropagatorCount: function() {
        return this.messagePropagatorList.getCount();
    },

    /**
     * @param {MessagePropagator} messagePropagator
     * @return {boolean}
     */
    hasMessagePropagator: function(messagePropagator) {
        return this.messagePropagatorList.contains(messagePropagator);
    },

    /**
     * @return {boolean}
     */
    isMessagePropagatorListEmpty: function() {
        return this.messagePropagatorList.isEmpty();
    },

    /**
     * @param {MessagePropagator} messagePropagator
     * @return {boolean}
     */
    removeMessagePropagator: function(messagePropagator) {
        var result = this.messagePropagatorList.remove(messagePropagator);
        if (result) {
            messagePropagator.removeEventPropagator(this);
        }
        return result;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MessageBroadcaster, IMessagePropagator);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('MessageBroadcaster', MessageBroadcaster);
