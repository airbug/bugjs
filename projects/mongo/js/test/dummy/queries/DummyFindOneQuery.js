//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('mongo.DummyFindOneQuery')

//@Require('Class')
//@Require('mongo.DummyMongoQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var DummyMongoQuery     = bugpack.require('mongo.DummyMongoQuery');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {DummyMongoQuery}
 */
var DummyFindOneQuery = Class.extend(DummyMongoQuery, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyMongooseModel} dummyMongooseModel
     * @param {string} queryParams
     */
    _constructor: function(dummyMongooseModel, queryParams) {

        this._super(dummyMongooseModel);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {object}
         */
        this.queryParams     = queryParams;

        /**
         * @private
         * @type {boolean}
         */
        this.queryLean      = false;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} queryLean
     */
    lean: function(queryLean) {
        this.queryLean = queryLean;
        return this;
    },

    query: function() {
        return this.findOne(this.queryParams);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.DummyFindOneQuery', DummyFindOneQuery);
