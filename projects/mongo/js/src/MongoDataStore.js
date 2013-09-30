//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('mongo')

//@Export('MongoDataStore')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('mongo.MongoManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Map             = bugpack.require('Map');
var Obj             = bugpack.require('Obj');
var MongoManager    = bugpack.require('mongo.MongoManager');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MongoDataStore = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(mongoose) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<Class, MongoManager>}
         */
        this.managerMap     = new Map();

        /**
         * @private
         * @type {Mongoose}
         */
        this.mongoose       = mongoose;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} url
     */
    connect: function(url) {
        this.mongoose.connect(url);
    },

    /**
     * @param {string} modelName
     * @return {MongoManager}
     */
    generateManager: function(modelName) {
        var manager = this.managerMap.get(modelName);
        if (!manager) {
            var model   = this.mongoose.model(modelName);
            var schema  = model.schema;
            manager     = new MongoManager(model, schema);
        }
        return manager;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.MongoDataStore', MongoDataStore);