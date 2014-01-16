//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('mongo')

//@Export('DummyFindQuery')

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
var DummyFindQuery = Class.extend(DummyMongoQuery, {

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
        var dataObject = this.getManager().getDataObject();
        var entities = [];
        console.log("DummyFindQuery - this.queryParams:", this.queryParams,
            " this.getManager().getDataObject():", this.getManager().getDataObject());

        for (var id in dataObject) {
            if (dataObject.hasOwnProperty(id)) {
                var entity = dataObject[id];
                var matches = 0;
                var expectedMatches = 0;
                for (var key in this.queryParams) {
                    if (this.queryParams.hasOwnProperty(key)) {
                        expectedMatches++;
                        var expectedValue = this.queryParams[key];
                        if (entity[key] === expectedValue) {
                            matches++;
                        }
                    }
                }
                if (matches === expectedMatches) {
                    entities.push(entity);
                }
            }
        }
        return entities;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.DummyFindQuery', DummyFindQuery);
