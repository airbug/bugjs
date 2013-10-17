/-------------------------------------------------------------------------------
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
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.collectionOf   = "";

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
            if (TypeUtil.isBoolean(options.id)) {
                this.id = options.id;
            }
            if (TypeUtil.isBoolean(options.indexed)) {
                this.indexed = options.indexed;
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
    isUnique: function() {
        return this.unique;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.SchemaProperty', SchemaProperty);
