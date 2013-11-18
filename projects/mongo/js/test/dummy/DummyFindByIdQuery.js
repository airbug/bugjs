//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('mongo')

//@Export('DummyFindByIdQuery')

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
var DummyFindByIdQuery = Class.extend(DummyMongoQuery, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyMongoManager} manager
     * @param {string} queryId
     */
    _constructor: function(manager, queryId) {

        this._super(manager);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.queryId     = queryId;

        /**
         * @private
         * @type {boolean}
         */
        this.queryLean   = false;
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

        //TEST
        console.log("DummyFindByIdQuery - this.queryId:", this.queryId, " this.getManager().getDataObject():", this.getManager().getDataObject());

        return this.getManager().getDataObject()[this.queryId];
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.DummyFindByIdQuery', DummyFindByIdQuery);
