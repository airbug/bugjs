//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('mongo')

//@Export('MongoManager')

//@Require('Class')
//@Require('Obj')
//@Require('Proxy')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');
var Proxy   = bugpack.require('Proxy');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MongoManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(model, schema){

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {mongoose.Model}
         */
        this.model      = model;

        /**
         * @private
         * @type {mongoose.Schema}
         */
        this.schema     = schema;


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
        return this.model;
    },

    /**
     * @return {mongoose.Schema}
     */
    getSchema: function() {
        return this.schema;
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
        this.schema.path(attribute).validate(validationFunction, errorMessage);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.MongoManager', MongoManager);
