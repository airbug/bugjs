//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('Entity')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Entity = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Class} entityClass
     * @param {Object} instance
     * @param {Schema} schema
     */
    _constructor: function(entityClass, instance, schema) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Class}
         */
        this.entityClass        = entityClass;

        /**
         * @private
         * @type {*}
         */
        this.instance           = instance;

        /**
         * @private
         * @type {Schema}
         */
        this.schema             = schema;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Class}
     */
    getEntityClass: function() {
        return this.entityClass;
    },

    /**
     * @return {*}
     */
    getInstance: function() {
        return this.instance;
    },

    /**
     * @return {*}
     */
    getInstanceId: function() {
        var idProperty = this.schema.getIdProperty();
        return this.instance[idProperty.getName()];
    },

    /**
     * @return {Schema}
     */
    getSchema: function() {
        return this.schema;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.Entity', Entity);
