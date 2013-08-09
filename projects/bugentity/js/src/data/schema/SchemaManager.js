//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('SchemaManager')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Map')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Event               = bugpack.require('Event');
var EventDispatcher     = bugpack.require('EventDispatcher');
var Map                 = bugpack.require('Map');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SchemaManager = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<Class, Schema>}
         */
        this.classToSchemaMap   = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Class} _class
     * @return {Schema}
     */
    getSchemaByClass: function(_class) {
        return this.classToSchemaMap.get(_class);
    },

    /**
     * @param {Class} _class
     * @return {boolean}
     */
    hasSchemaForClass: function(_class) {
        return this.classToSchemaMap.containsKey(_class);
    },

    /**
     * @param {Schema} schema
     */
    registerSchema: function(schema) {
        if (!this.hasSchemaForClass(schema.getEntityClass())) {
            this.classToSchemaMap.put(schema.getEntityClass(), schema);
            this.dispatchEvent(new Event(SchemaManager.EventTypes.SCHEMA_REGISTERED, {schema: schema}));
        } else {
            throw new Error("Schema already registered for class - class:", schema.getEntityClass());
        }
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
SchemaManager.EventTypes = {
    SCHEMA_REGISTERED: "SchemaManager:SchemaRegistered"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.SchemaManager', SchemaManager);
