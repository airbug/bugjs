//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('SchemaProperty')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var TypeUtil    = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SchemaProperty = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(name, type, options) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.collectionOf   = "";

        /**
         * @private
         * @type {*}
         */
        this.default        = null;

        /**
         * @private
         * @type {boolean}
         */
        this.id             = false;

        /**
         * @private
         * @type {boolean}
         */
        this.indexed        = false;

        /**
         * @private
         * @type {string}
         */
        this.name           = name;

        /**
         * @private
         * @type {boolean}
         */
        this.populates      = false;

        /**
         * @private
         * @type {boolean}
         */
        this.primaryId      = false;

        /**
         * @private
         * @type {boolean}
         */
        this.required       = false;

        /**
         * @private
         * @type {boolean}
         */
        this.stored         = true;

        /**
         * @private
         * @type {string}
         */
        this.type           = type;

        /**
         * @private
         * @type {boolean}
         */
        this.unique         = false;

        if (options) {
            if (TypeUtil.isString(options.collectionOf)) {
                this.collectionOf = options.collectionOf;
            }
            if (!TypeUtil.isUndefined(options.default) && !TypeUtil.isNull(options.default)) {
                this.default = options.default;
            }
            if (TypeUtil.isBoolean(options.id)) {
                this.id = options.id;
            }
            if (TypeUtil.isBoolean(options.indexed)) {
                this.indexed = options.indexed;
            }
            if (TypeUtil.isBoolean(options.populates)) {
                this.populates = options.populates;
            }
            if (TypeUtil.isBoolean(options.primaryId)) {
                this.primaryId = options.primaryId;
            }
            if (TypeUtil.isBoolean(options.required)) {
                this.required = options.required;
            }
            if (TypeUtil.isBoolean(options.stored)) {
                this.stored = options.stored;
            }
            if (TypeUtil.isBoolean(options.unique)) {
                this.unique = options.unique;
            }
        }
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getCollectionOf: function() {
        return this.collectionOf;
    },

    /**
     * @return {*}
     */
    getDefault: function() {
        return this.default;
    },

    /**
     * @return {string}
     */
    getName: function() {
        return this.name;
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.type;
    },


    //-------------------------------------------------------------------------------
    // Convenience Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    hasDefault: function() {
        return !TypeUtil.isNull(this.default);
    },

    /**
     * @return {boolean}
     */
    isId: function() {
        return this.id;
    },

    /**
     * @return {boolean}
     */
    isIndexed: function() {
        return this.indexed;
    },

    /**
     * @return {boolean}
     */
    isPopulates: function() {
        return this.populates;
    },

    /**
     * @return {boolean}
     */
    isPrimaryId: function() {
        return this.primaryId;
    },

    /**
     * @return {boolean}
     */
    isRequired: function() {
        return this.required;
    },

    /**
     * @return {boolean}
     */
    isStored: function() {
        return this.stored;
    },

    /**
     * @return {boolean}
     */
    isUnique: function() {
        return this.unique;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    generateDefault: function() {
        var value = this.default;
        if (TypeUtil.isFunction(value)) {
            value = value();
        }
        switch(this.type) {
            case "date":
                return new Date(value);
            default:
                return value;
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.SchemaProperty', SchemaProperty);
