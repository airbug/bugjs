//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('mongo.DummyRemoveQuery')

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
var DummyRemoveQuery = Class.extend(DummyMongoQuery, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyMongooseModel} dummyMongooseModel
     * @param {Object} queryParams
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
        var dataObject      = this.getDummyMongooseModel().getCollection();
        var removeCount     = 0;
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
                    removeCount++;
                    delete dataObject[id];
                }
            }
        }
        return removeCount;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.DummyRemoveQuery', DummyRemoveQuery);
