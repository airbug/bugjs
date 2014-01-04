//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('mongo')

//@Export('DummyWhereQuery')

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
var DummyWhereQuery = Class.extend(DummyMongoQuery, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyMongoManager} manager
     * @param {string} queryId
     */
    _constructor: function(manager, queryParams) {

        this._super(manager);


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
         * @type {Array<string>} queryIn
         */
        this.queryIn        = undefined;

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

    'in': function(items) {
        this.queryIn = items;
        return this;
    },

    query: function() {
        var dataObject = this.getManager().getDataObject();
        var results = [];
        var whereField = this.queryParams;
        for (var id in dataObject) {
            if (dataObject.hasOwnProperty(id)) {
                var dataRecord = dataObject[id];
                if (dataRecord.hasOwnProperty(whereField)) {
                    var fieldValue = dataRecord[whereField].toString();
                    if (this.queryIn.indexOf(fieldValue) != -1) {
                        results.push(dataRecord);
                    }
                }
            }
        }
        return results;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.DummyWhereQuery', DummyWhereQuery);
