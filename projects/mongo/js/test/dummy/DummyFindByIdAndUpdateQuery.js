//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('mongo')

//@Export('DummyFindByIdAndUpdateQuery')

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
var DummyFindByIdAndUpdateQuery = Class.extend(DummyMongoQuery, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyMongoManager} manager
     * @param {string} queryId
     * @param {Object} updateObject
     */
    _constructor: function(manager, queryId, updateObject) {

        this._super(manager);


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
        var object = this.getManager().getDataObject()[this.queryId];
        //TODO BRN: Handle update object
        return object;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.DummyFindByIdAndUpdateQuery', DummyFindByIdAndUpdateQuery);
