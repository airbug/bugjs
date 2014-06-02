//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.CallResponse')

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
var CallResponse = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} type
     * @param {*} data
     * @param {string} requestUuid
     */
    _constructor: function(type, data, requestUuid) {

        this._super();

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.data           = data;

        /**
         * @private
         * @type {string}
         */
        this.requestUuid    = requestUuid;

        /**
         * @private
         * @type {string}
         */
        this.type           = type;

        /**
         * @private
         * @type {string}
         */
        this.uuid           = UuidGenerator.generateUuid();
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
    getRequestUuid: function() {
        return this.requestUuid
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
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {{requestUuid: string, type: string, data: *, uuid: string}}
     */
    toObject: function() {
        return {
            requestUuid: this.getRequestUuid(),
            type: this.getType(),
            data: this.getData(),
            uuid: this.getUuid()
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(CallResponse, IObjectable);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(CallResponse).with(
    marsh("CallResponse")
        .properties([
            property("data"),
            property("requestUuid"),
            property("type"),
            property("uuid")
        ])
);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallResponse', CallResponse);
