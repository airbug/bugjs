//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MessageProxy')

//@Require('Class')
//@Require('IMessageReceiver')
//@Require('Obj')
//@Require('UuidGenerator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IMessageReceiver    = bugpack.require('IMessageReceiver');
var Obj                 = bugpack.require('Obj');
var UuidGenerator       = bugpack.require('UuidGenerator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageProxy = Class.extend(Obj, {

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
         * @type {string}
         */
        this.address = UuidGenerator.generateUuid();

        /**
         * @private
         * @type {MessageReceiver}
         */
        this.messageReceiver = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MessageReceiver}
     */
    getMessageReceiver: function() {
        return this.messageReceiver;
    },

    /**
     * @param {MessageReceiver} messageReceiver
     */
    setMessageReceiver: function(messageReceiver) {
        return this.messageReceiver = messageReceiver;
    },


    //-------------------------------------------------------------------------------
    // IMessageReceiver Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getAddress: function() {
        return this.address;
    },

    /**
     * @param {Message} message
     * @param {string} channel
     */
    receiveMessage: function(message, channel) {
        this.messageReceiver.receiveMessage(message, channel);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MessageProxy, IMessageReceiver);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('MessageProxy', MessageProxy);
