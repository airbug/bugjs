//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.CallRequest')

//@Require('Class')
//@Require('IObjectable')
//@Require('Obj')
//@Require('UuidGenerator')
//@Require('bugmarsh.MarshTag');
//@Require('bugmarsh.MarshPropertyTag');
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var IObjectable                 = bugpack.require('IObjectable');
var Obj                         = bugpack.require('Obj');
var UuidGenerator               = bugpack.require('UuidGenerator');
var MarshTag             = bugpack.require('bugmarsh.MarshTag');
var MarshPropertyTag     = bugpack.require('bugmarsh.MarshPropertyTag');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var marsh                       = MarshTag.marsh;
var property                    = MarshPropertyTag.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var CallRequest = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} type
     * @param {*} data
     */
    _constructor: function(type, data) {

        this._super();

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.data = data;

        /**
         * @private
         * @type {string}
         */
        this.type = type;

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
     * @return {*}
     */
    getData: function() {
        return this.data;
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
        return this.uuid
    },

    /**
     * @param {string} uuid
     */
    setUuid: function(uuid) {
        this.uuid = uuid;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {{uuid: string, type: string, data: *}}
     */
    toObject: function() {
        return {
            uuid: this.getUuid(),
            type: this.getType(),
            data: this.getData()
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(CallRequest, IObjectable);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(CallRequest).with(
    marsh("CallRequest")
        .properties([
            property("data"),
            property("type"),
            property("uuid")
        ])
);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallRequest', CallRequest);
