//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('redis.DummyRedisQuery')

//@Require('Class')
//@Require('Obj')
//@Require('bugtrace.BugTrace')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var BugTrace            = bugpack.require('bugtrace.BugTrace');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $trace          = BugTrace.$trace;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var DummyRedisQuery = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyRedis} dummyRedisClient
     */
    _constructor: function(dummyRedisClient) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DummyRedisClient}
         */
        this.dummyRedisClient = dummyRedisClient;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {DummyRedisClient}
     */
    getDummyRedisClient: function() {
        return this.dummyRedisClient;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error, *=)} callback
     */
    exec: function(callback) {
        var _this   = this;
        var result  = null;
        var error   = null;
        if (!callback) {
            throw new Error("callback is undefined");
        }
        setTimeout($trace(function() {
            try {
                result = _this.query();
            } catch(e) {
                error = e;
            }
            if (!error) {
                callback(null, result);
            } else {
                callback(error);
            }
        }), 0);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('redis.DummyRedisQuery', DummyRedisQuery);
