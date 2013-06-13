//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('handshaker')

//@Export('Handshaker')

//@Require('Class')
//@Require('BugFlow')
//@Require('Set')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var Obj                 = bugpack.require('Obj');
var Set                 = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $forEachParallel    = BugFlow.$forEachParallel;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Handshaker = Class.extend(Obj, {

    /**
     * @param {Array.<Hand>} args
     */
    _constructor: function(args){

        this._super();

        this.hands = new Set(args);
    },

    /**
     @param {Hand} hand
     */
    addHand: function(hand){
        this.hands.add(hand);
    },

    /**
     @param {Array.<Hand> | ...Hand} hand
     */
    addHands: function(hands){
        if(TypeUtil.isArray(hands)){
            this.hands.addAll(hands);
        } else {
            this.hands.addAll(Array.prototype.slice.call(arguments));
        }
    },

    /**
     @param {Hand} hand
     @return {boolean}
     */
    hasHand: function(hand){
        return this.hands.contains(hand);
    },

    /**
     @param {Hand} hand
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
     *  , url: request.url          // <String> the entrance path of the request
     *  , query: data.query          // <Object> the result of url.parse().query or a empty object
     * } handshakeData
     * @param {function(error, authorized)} callback
     */
    shake: function(handshakeData, callback){
        var authorizations = new Set();
        $foreachParallel(flow, this.hand, function(hand){
            hand.authorize(handshakeData, function(error, authorized){
                authorizations.add(authorized);
                flow.complete(error);
            });
        }).execute(function(error){
            callback(error, !authorizations.contains(false));
        });
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('handshaker.Handshaker', Handshaker);