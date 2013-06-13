//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmessage')

//@Export('Message')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('UuidGenerator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Map             = bugpack.require('Map');
var Obj             = bugpack.require('Obj');
var TypeUtil        = bugpack.require('TypeUtil');
var UuidGenerator   = bugpack.require('UuidGenerator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Message = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(type, data) {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Object}
         */
        this.data = data;

        /**
         * @private
         * @type {Map.<string, *>}
         */
        this.headerMap = new Map();

        /**
         * @private
         * @type {string}
         */
        this.type = TypeUtil.isString(type) ? type : "";

        /**
         * @private
         * @type {string}
         */
        this.uuid = UuidGenerator.generateUuid();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getData: function() {
        return this.data;
    },

    /**
     * @param {string} name
     * @return {*}
     */
    getHeader: function(name) {
        return this.headerMap.get(name);
    },

    /**
     * @param {string} name
     * @param {*} header
     */
    setHeader: function(name, header) {
        this.headerMap.put(name, header);
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.type;
    },

    /**
     * @return {string}
     */
    getUuid: function() {
        return this.uuid;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        var _this = this;
        var headerMapObject = {};
        this.headerMap.getKeyArray().forEach(function(name) {
            var header = _this.headerMap.get(name);
            headerMapObject[name] = header;
        });
        return {
            data: this.data,
            headerMap: headerMapObject,
            type: this.type,
            uuid: this.uuid
        };
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugmessage.Message', Message);