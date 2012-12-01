//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoutingRequest')

//@Require('Class')
//@Require('EventDispatcher')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('RoutingRequest');

var Class = bugpack.require('Class');
var EventDispatcher = bugpack.require('EventDispatcher');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoutingRequest = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(route, args) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array<*>}
         */
        this.args = args;

        /**
         * @private
         * @type {?string}
         */
        this.forwardFragment = null;

        /**
         * @private
         * @type {Object}}
         */
        this.forwardOptions = null;

        /**
         * @private
         * @type {boolean}
         */
        this.processed = false;

        /**
         * @private
         * @type {RoutingRequest.RejectedReason}
         */
        this.rejectedReason = null;

        /**
         * @private
         * @type {RoutingRequest.Result}
         */
        this.result = null;

        /**
         * @private
         * @type {ControllerRoute}
         */
        this.route = route;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Array<*>}
     */
    getArgs: function() {
        return this.args;
    },

    /**
     * @return {?string}
     */
    getForwardFragment: function() {
        return this.forwardFragment;
    },

    /**
     * @return {Object}
     */
    getForwardOptions: function() {
        return this.forwardOptions;
    },

    /**
     * @return {RoutingRequest.RejectedReason}
     */
    getRejectedReason: function() {
        return this.rejectedReason;
    },

    /**
     * @return {RoutingRequest.Result}
     */
    getResult: function() {
        return this.result;
    },

    /**
     * @return {ControllerRoute}
     */
    getRoute: function() {
        return this.route;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    accept: function() {
        this.processRequest(RoutingRequest.Result.ACCEPTED);
    },

    /**
     * @param {string} fragment
     * @param {Object} options
     */
    forward: function(fragment, options) {
        var _this = this;
        this.processRequest(RoutingRequest.Result.FORWARDED, function() {
            _this.forwardFragment = fragment;
            _this.forwardOptions = options
        });
    },

    /**
     * @param {RoutingRequest.RejectReason} rejectReason
     */
    reject: function(rejectReason) {
        var _this = this;
        this.processRequest(RoutingRequest.Result.REJECTED, function() {
            _this.rejectReason = rejectReason;
        });
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {RoutingRequest.Result} result
     * @param {?function()} callback
     */
    processRequest: function(result, callback) {
        if (!this.processed) {
            this.processed = true;
            this.result = result;
            if (callback) {
                callback();
            }
            this.dispatchEvent(new Event(RoutingRequest.EventType.PROCESSED, {}));
        } else {
            throw new Error("RoutingRequest has already been processed");
        }
    }
});



//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
RoutingRequest.EventType = {
    PROCESSED: "RoutingRequest:Processed"
};

/**
 * @enum {string}
 */
RoutingRequest.Result = {
    ACCEPTED: "RoutingRequest:Accepted",
    FORWARDED: "RoutingRequest:Forwarded",
    REJECTED: "RoutingRequest:Rejected"
};

/**
 * @enum {string}
 */
RoutingRequest.RejectedReason = {
    UNKNOWN_ROUTE: "RoutingRequest:UnknownRoute",
    UNAUTHORIZED_ROUTE: "RoutingRequest:UnauthorizedRoute"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(RoutingRequest);
