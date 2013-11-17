//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('mongo')

//@Export('DummyMongoDataStore')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('mongo.DummyMongoManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var DummyMongoManager   = bugpack.require('mongo.DummyMongoManager');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DummyMongoDataStore = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<Class, DummyMongoManager>}
         */
        this.managerMap     = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} url
     */
    connect: function(url) {
        //do nothing
    },

    /**
     * @param {string} modelName
     * @return {MongoManager}
     */
    generateManager: function(modelName) {
        var manager = this.managerMap.get(modelName);
        if (!manager) {
            manager     = new DummyMongoManager(modelName);
        }
        return manager;
    },

    /**
     * @param {string} name
     * @return {*}
     */
    getSchemaForName: function(name) {
        var model   = this.mongoose.model(name);
        return model.schema;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.DummyMongoDataStore', DummyMongoDataStore);
