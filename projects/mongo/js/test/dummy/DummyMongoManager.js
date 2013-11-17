//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('mongo')

//@Export('DummyMongoManager')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DummyMongoManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(model, schema){

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        Proxy.proxy(this, this.model, [
            '$where',
            'aggregate',
            'count',
            'create',
            'distinct',
            'ensureIndexes',
            'find',
            'findById',
            'findByIdAndRemove',
            'findByIdAndUpdate',
            'findOne',
            'findOneAndRemove',
            'findOneAndUpdate',
            'mapReduce',
            'populate',
            'remove',
            'update',
            'where'
        ]);

        Proxy.proxy(this, this.schema, [
            'pre',
            'post',
            'virtual'
        ]);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {mongoose.Model}
     */
    getModel: function() {
        //TODO
    },

    /**
     * @return {mongoose.Schema}
     */
    getSchema: function() {
       //TODO
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    configure: function(callback) {
        callback()
    },

    /**
     * @private
     * @param {string} attribute
     * @param {function(value) | function(value, response)} validationFunction
     * @param {string} errorMessage
     */
    validate: function(attribute, validationFunction, errorMessage){
        //TODO
    },

    $where: function() {

    },
    aggregate: function() {

    },
    count: function() {

    },
    create: function() {

    },
    distinct: function() {

    },
    ensureIndexes: function() {

    },
    find: function() {

    },
    findById: function() {

    },
    findByIdAndRemove: function() {

    },
    findByIdAndUpdate: function() {

    },
    findOne: function() {

    },
    findOneAndRemove: function() {

    },
    findOneAndUpdate: function() {

    },
    mapReduce: function() {

    },
    populate: function() {

    },
    remove: function() {

    },
    update: function() {

    },
    where: function() {

    },
    pre: function() {

    },
    post: function() {

    },
    virtual: function() {
        //TODO BRN:
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.DummyMongoManager', DummyMongoManager);
