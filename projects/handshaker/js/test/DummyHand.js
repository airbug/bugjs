//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('handshaker')

//@Export('DummyHand')

//@Require('Class')
//@Require('Obj')
//@Require('handshaker.IHand')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var IHand               = bugpack.require('handshaker.IHand');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var DummyHand = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {boolean} shakeResult
     * @param {Throwable} shakeThrowable
     */
    _constructor: function(shakeResult, shakeThrowable) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.shakeResult        = shakeResult;

        /**
         * @private
         * @type {Throwable}
         */
        this.shakeThrowable     = shakeThrowable;
    },


    //-------------------------------------------------------------------------------
    // IHand Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *    headers: Object,
     *    time: Date,
     *    address: Object,
     *    xdomain: boolean,
     *    secure: boolean,
     *    issued: number,
     *    url: string,
     *    query: Object
     * }} handshakeData
     * @param {function(Throwable, boolean)} callback
     */
    shakeIt: function(handshakeData, callback) {
        callback(this.shakeThrowable, this.shakeResult);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(DummyHand, IHand);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('handshaker.DummyHand', DummyHand);
