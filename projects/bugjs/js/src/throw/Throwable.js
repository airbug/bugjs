//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Throwable')

//@Require('Class')
//@Require('IObjectable')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var IObjectable     = bugpack.require('IObjectable');
var Obj             = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Throwable = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {string} type
     * @param {*} data
     * @param {string} message
     * @param {Array.<Throwable>} causes
     * @private
     */
    _constructor: function(type, data, message, causes) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array.<Throwable>}
         */
        this.causes     = causes ? causes : [];

        /**
         * @private
         * @type {*}
         */
        this.data       = data;

        /**
         * @private
         * @type {string}
         */
        this.message    = message;

        /**
         * @private
         * @type {string}
         */
        this.type       = type;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Array.<Throwable>}
     */
    getCauses: function() {
        return this.causes;
    },

    /**
     * @return {*}
     */
    getData: function() {
        return this.data;
    },

    /**
     * @param {*} data
     */
    setData: function(data) {
        this.data = data;
    },

    /**
     * @return {string}
     */
    getMessage: function() {
        return this.message;
    },

    /**
     * @param {string} message
     */
    setMessage: function(message) {
        this.message = message;
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.type;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        return {
            causes: this.getCauses(),
            data: this.getData(),
            message: this.getMessage(),
            type: this.getType()
        }
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Throwable} cause
     */
    addCause: function(cause) {
        this.causes.push(cause);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Throwable, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Throwable', Throwable);
