//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmessage')

//@Export('MessageResponder')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('UuidGenerator')
//@Require('bugmessage.Response')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var TypeUtil        = bugpack.require('TypeUtil');
var UuidGenerator   = bugpack.require('UuidGenerator');
var Response        = bugpack.require('bugmessage.Response');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageResponder = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(messageResponderObject) {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.uuid = null;

        if (messageResponderObject) {
            if (TypeUtil.isString(messageResponderObject.uuid)) {
                this.uuid = messageResponderObject.uuid;
            }
        }

        if (!this.uuid) {
            UuidGenerator.generateUuid();
        }
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getUuid: function() {
        return this.uuid;
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    respond: function() {
        //TODO BRN: Generate a new Response
    },


    /**
     * @return {Object}
     */
    toObject: function() {
        return {
            uuid: this.uuid
        };
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugmessage.MessageResponder', MessageResponder);
