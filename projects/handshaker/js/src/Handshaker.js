//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('handshaker')

//@Export('Handshaker')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Collection')
//@Require('List')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugflow.BugFlow')
//@Require('handshaker.IHand')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack Modules
//-------------------------------------------------------------------------------

var ArgUtil             = bugpack.require('ArgUtil');
var Class               = bugpack.require('Class');
var Collection          = bugpack.require('Collection');
var List                = bugpack.require('List');
var Obj                 = bugpack.require('Obj');
var Set                 = bugpack.require('Set');
var TypeUtil            = bugpack.require('TypeUtil');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var IHand               = bugpack.require('handshaker.IHand');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $iterableSeries    = BugFlow.$iterableSeries;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Handshaker = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {Array.<IHand>} hands
     */
    _constructor: function(hands) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Set.<IHand>}
         */
        this.hands = new Set();

        if (hands) {
            this.addHands(hands);
        }
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {IHand} hand
     */
    addHand: function(hand) {
        if (Class.doesImplement(hand, IHand)) {
            this.hands.add(hand);
        } else {
            throw new Error("parameter 'hand' must implement IHand interface");
        }
    },

    /**
     * @param {(Array.<IHand> | Collection.<IHand> | ...IHand)} hands
     */
    addHands: function(hands) {
        var _this = this;
        if (!Class.doesExtend(hands, Collection) && !TypeUtil.isArray(hands)) {
            var args = ArgUtil.toArray(arguments);
            hands = this.hands.addAll(args);
        }
        hands.forEach(function(hand) {
            _this.addHand(hand);
        });
    },

    /**
     * @returns {number}
     */
    getHandCount: function() {
        return this.hands.getCount();
    },

    /**
     * @param {IHand} hand
     * @return {boolean}
     */
    hasHand: function(hand) {
        return this.hands.contains(hand);
    },

    /**
     * @param {IHand} hand
     */
    removeHand: function(hand) {
        this.hands.remove(hand);
    },

    /**
     * @param {
     *    headers: req.headers       // <Object> the headers of the request
     *  , time: (new Date) +''       // <String> date time of the connection
     *  , address: socket.address()  // <Object> remoteAddress and remotePort object
     *  , xdomain: !!headers.origin  // <Boolean> was it a cross domain request?
     *  , secure: socket.secure      // <Boolean> https connection
     *  , issued: +date              // <Number> EPOCH of when the handshake was created
     *  , url: request.url           // <String> the entrance path of the request
     *  , query: data.query          // <Object> the result of url.parse().query or a empty object
     * } handshakeData
     * @param {function(Throwable, boolean)} callback
     */
    shake: function(handshakeData, callback) {
        var authorizations = new List();
        $iterableSeries(this.hands, function(flow, hand) {
            hand.shakeIt(handshakeData, function(throwable, authorized) {
                if (!throwable) {
                    authorizations.add(authorized);
                }
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            if (!throwable) {
                callback(undefined, !authorizations.contains(false));
            } else {
                callback(throwable, false);
            }
        });
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('handshaker.Handshaker', Handshaker);
