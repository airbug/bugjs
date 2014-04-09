//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.OutgoingRequest')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('bugcall.RequestEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventDispatcher     = bugpack.require('EventDispatcher');
var RequestEvent        = bugpack.require('bugcall.RequestEvent');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {EventDispatcher}
 */
var OutgoingRequest = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(callRequest) {

        this._super();

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallRequest}
         */
        this.callRequest        = callRequest;

        /**
         * @private
         * @type {OutgoingRequest.State}
         */
        this.state             = OutgoingRequest.State.READY;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CallRequest}
     */
    getCallRequest: function() {
        return this.callRequest;
    },

    /**
     * @return {OutgoingRequest.State}
     */
    getState: function() {
        return this.state;
    },


    //-------------------------------------------------------------------------------
    // Convenience Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getUuid: function() {
        return this.callRequest.getUuid();
    },

    /**
     * @return {boolean}
     */
    isQueued: function() {
        return this.state === OutgoingRequest.State.QUEUED;
    },

    /**
     * @return {boolean}
     */
    isReady: function() {
        return this.state === OutgoingRequest.State.READY;
    },

    /**
     * @return {boolean}
     */
    isSent: function() {
        return this.state === OutgoingRequest.State.SENT;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    changeStateQueued: function() {
        if (!this.isQueued()) {
            this.state = OutgoingRequest.State.QUEUED;
            this.dispatchEvent(new RequestEvent(RequestEvent.Types.QUEUED));
        }
    },

    /**
     *
     */
    changeStateSent: function() {
        if (!this.isSent()) {
            this.state = OutgoingRequest.State.SENT;
            this.dispatchEvent(new RequestEvent(RequestEvent.Types.SENT));
        }
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
OutgoingRequest.State = {
    READY: "OutgoingRequest:State:Ready",
    QUEUED: "OutgoingRequest:State:Queued",
    SENT: "OutgoingRequest:State:Sent"
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.OutgoingRequest', OutgoingRequest);
