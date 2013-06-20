//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('handshaker')

//@Export('Handshaker')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var Set                 = bugpack.require('Set');
var TypeUtil            = bugpack.require('TypeUtil');
var BugFlow             = bugpack.require('bugflow.BugFlow');


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
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Set.<IHand>}
         */
        this.hands = new Set(hands);
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {IHand} hand
     */
    addHand: function(hand){
        this.hands.add(hand);
    },

    /**
     * @param {Array.<IHand> | ...IHand} hands
     */
    addHands: function(hands){
        if (TypeUtil.isArray(hands)) {
            this.hands.addAll(hands);
        } else {
            this.hands.addAll(Array.prototype.slice.call(arguments));
        }
    },

    /**
     * @param {IHand} hand
     * @return {boolean}
     */
    hasHand: function(hand){
        return this.hands.contains(hand);
    },

    /**
     * @param {IHand} hand
     */
    removeHand: function(hand){
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
     * @param {function(error, authorized)} callback
     */
    shake: function(handshakeData, callback){
        var authorizations = new Set();
        $iterableSeries(this.hands, function(flow, hand) {
            hand.shakeIt(handshakeData, function(error, authorized) {
                authorizations.add(authorized);
                flow.complete(error);
            });
        }).execute(function(error) {
            callback(error, !authorizations.contains(false));
        });
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('handshaker.Handshaker', Handshaker);
