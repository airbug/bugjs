//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('mongo.DummyFindByIdAndRemoveQuery')

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
var DummyFindByIdAndRemoveQuery = Class.extend(DummyMongoQuery, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyMongooseModel} dummyMongooseModel
     * @param {string} queryId
     * @param {Object} updateObject
     */
    _constructor: function(dummyMongooseModel, queryId, updateObject) {

        this._super(dummyMongooseModel);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.queryId        = queryId;

        /**
         * @private
         * @type {boolean}
         */
        this.queryLean      = false;

        /**
         * @private
         * @type {Object}
         */
        this.updateObject   = updateObject;
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
        delete this.getDummyMongooseModel().getCollection()[this.queryId];
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.DummyFindByIdAndRemoveQuery', DummyFindByIdAndRemoveQuery);
