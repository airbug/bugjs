//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('CallManager')

//@Require('Call')
//@Require('Class')
//@Require('Map')
//@Require('MessageProxy')
//@Require('MessageRouter')
//@Require('Obj')
//@Require('Queue')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack =   require('bugpack').context();
var io =        require('socket.io-client');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Call            = bugpack.require('Call');
var Class           = bugpack.require('Class');
var Map             = bugpack.require('Map');
var MessageProxy    = bugpack.require('MessageProxy');
var MessageRouter   = bugpack.require('MessageRouter');
var Obj             = bugpack.require('Obj');
var Queue           = bugpack.require('Queue');
var Set             = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CallManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        var _this = this;
        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MessageRouter}
         */
        this.incomingMessageRouter = new MessageRouter();

        /**
         * @private
         * @type {MessageProxy}
         */
        this.outgoingMessageProxy = new MessageProxy();

        /**
         * @private
         * @type {IMessageReceiver}
         */
        this.outgoingMessageReceiver = null;

        /**
         * @private
         * @type {Set.<Call>}
         */
        this.registerdCallSet = new Set();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MessageRouter}
     */
    getIncomingMessageRouter: function() {
        return this.incomingMessageRouter;
    },

    /**
     *
     * @param {IMessageReceiver} messageReceiver
     */
    setOutGoingMessageReceiver: function(messageReceiver) {
        this.outgoingMessageReceiver = messageReceiver;
        this.outgoingMessageProxy.setMessageReceiver(this.outgoingMessageReceiver)
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Call} call
     */
    deregisterCall: function(call) {
        if (this.registerdCallSet.contains(call)) {
            this.registerdCallSet.remove(call);
            this.incomingMessageRouter.removeMessageReceiver(call);
            call.setMessageReceiver(null);
            call.removeEventListener(Call.EventTypes.COMPLETE, this.hearCallComplete, this);
        }
    },

    /**
     * @param {Call} call
     */
    registerCall: function(call) {
        if (!this.registerdCallSet.contains(call)) {
            this.registerdCallSet.add(call);
            this.incomingMessageRouter.addMessageReceiver(call);
            call.setMessageReceiver(this.outgoingMessageProxy);
            call.addEventListener(Call.EventTypes.COMPLETE, this.hearCallComplete, this);
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearCallComplete: function(event) {
        var call = event.getTarget();
        this.deregisterCall(call);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('CallManager', CallManager);
