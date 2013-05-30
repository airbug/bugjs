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
         * @type {IMessagePropagator}
         */
        this.outgoingMessagePropagator = null;

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
     * @param {IMessagePropagator} messagePropagator
     */
    setOutgoingMessagePropagator: function(messagePropagator) {
        this.outgoingMessagePropagator = messagePropagator;
        this.outgoingMessageProxy.setMessagePropagator(this.outgoingMessagePropagator)
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
            this.incomingMessageRouter.removeMessagePropagator(call);
            call.setOutGoingMessagePropagator(null);
            call.removeEventListener(Call.EventTypes.CLEANUP, this.hearCallCleanup, this);
        }
    },

    /**
     * @param {Call} call
     */
    registerCall: function(call) {
        if (!this.registerdCallSet.contains(call)) {
            this.registerdCallSet.add(call);
            this.incomingMessageRouter.addMessagePropagator(call);
            call.setOutGoingMessagePropagator(this.outgoingMessageProxy);
            call.addEventListener(Call.EventTypes.CLEANUP, this.hearCallCleanup, this);
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearCallCleanup: function(event) {
        var call = event.getTarget();
        this.deregisterCall(call);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('CallManager', CallManager);
