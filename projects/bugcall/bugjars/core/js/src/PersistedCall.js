//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.PersistedCall')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PersistedCall = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} callUuid
     * @param {boolean} reconnect
     * @param {boolean} open
     */
    _constructor: function(callUuid, reconnect, open) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.callUuid                           = callUuid || "";

        /**
         * @private
         * @type {boolean}
         */
        this.open                               = open || false;

        /**
         * @private
         * @type {boolean}
         */
        this.reconnect                          = reconnect || false;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getCallUuid: function() {
        return this.callUuid;
    },

    /**
     * @param {string} callUuid
     */
    setCallUuid: function(callUuid) {
        this.callUuid = callUuid;
    },

    /**
     * @return {boolean}
     */
    getOpen: function() {
        return this.open;
    },

    /**
     * @param {boolean} open
     */
    setOpen: function(open) {
        this.open = open;
    },

    /**
     * @return {boolean}
     */
    isOpen: function() {
        return this.open;
    },

    /**
     * @return {boolean}
     */
    getReconnect: function() {
        return this.open;
    },

    /**
     * @param {boolean} reconnect
     */
    setReconnect: function(reconnect) {
        this.reconnect = reconnect;
    },

    /**
     * @return {boolean}
     */
    isReconnect: function() {
        return this.reconnect;
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.PersistedCall', PersistedCall);
