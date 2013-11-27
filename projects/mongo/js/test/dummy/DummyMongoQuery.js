//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('mongo')

//@Export('DummyMongoQuery')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var DummyMongoQuery = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function(manager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DummyMongoManager}
         */
        this.manager = manager;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    exec: function(callback) {
        var result = this.query();
        callback(undefined, result);
    },


    //-------------------------------------------------------------------------------
    // Test Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {DummyMongoManager}
     */
    getManager: function() {
        return this.manager;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.DummyMongoQuery', DummyMongoQuery);