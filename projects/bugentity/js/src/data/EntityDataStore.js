//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityDataStore')

//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Bug                     = bugpack.require('Bug');
var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var Set                     = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var EntityDataStore = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Logger} logger
     * @param {SchemaManager} schemaManager
     */
    _constructor: function(logger, schemaManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Logger}
         */
        this.logger                 = logger;

        /**
         * @private
         * @type {SchemaManager}
         */
        this.schemaManager          = schemaManager;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Logger}
     */
    getLogger: function() {
        return this.logger;
    },

    /**
     * @return {SchemaManager}
     */
    getSchemaManager: function() {
        return this.schemaManager;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    processSchemas: function() {
        var _this = this;
        var embeddedSchemaSet   = new Set();
        var primarySchemaSet    = new Set();

        // TODO BRN: This only works for a double layer schema system. Really need to implement a system that determines
        // the dependency structure of the Schemas

        this.schemaManager.getSchemaCollection().forEach(function(entitySchema) {
            if (entitySchema.getEntityEmbedded()) {
                embeddedSchemaSet.add(entitySchema);
            } else {
                primarySchemaSet.add(entitySchema);
            }
        });
        embeddedSchemaSet.forEach(function(entitySchema) {
            _this.processSchema(entitySchema);
        });
        primarySchemaSet.forEach(function(entitySchema) {
            _this.processSchema(entitySchema);
        })
    },


    //-------------------------------------------------------------------------------
    // Abstract Methods
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @param {EntitySchema} entitySchema
     */
    processSchema: function(entitySchema) {
        throw new Bug("AbstractMethodNotImplemented", {}, "Abstract method 'processSchema' has not been implemented");
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityDataStore', EntityDataStore);
