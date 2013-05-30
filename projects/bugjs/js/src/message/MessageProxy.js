//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MessageProxy')

//@Require('Class')
//@Require('IMessagePropagator')
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
var MessagePropagator   = bugpack.require('MessagePropagator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageProxy = Class.extend(MessagePropagator, {

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
         * @type {IMessagePropagator}
         */
        this.messagePropagator = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {IMessagePropagator}
     */
    getMessagePropagator: function() {
        return this.messagePropagator;
    },

    /**
     * @param {IMessagePropagator} messagePropagator
     */
    setMessagePropagator: function(messagePropagator) {
        if (this.messagePropagator) {
            this.messagePropagator.removeEventPropagator(this);
        }
        this.messagePropagator = messagePropagator;
        this.messagePropagator.addEventPropagator(this);
    },


    //-------------------------------------------------------------------------------
    // IMessagePropagator Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {string} channel
     */
    propagateMessage: function(message, channel) {
        this.messagePropagator.propagateMessage(message, channel);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MessageProxy, IMessagePropagator);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('MessageProxy', MessageProxy);
