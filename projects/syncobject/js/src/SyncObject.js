//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbug')

//@Export('SyncObject')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Event           = bugpack.require('Event');
var EventDispatcher = bugpack.require('EventDispatcher');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SyncObject = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(syncObject) {

        this._super();

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        this.syncObject = syncObject;
    },

    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} prop
     * @return {*}
     */
    get: function(prop) {
        return this.syncObject[prop];
    },

    /**
     * @param {string} prop
     */
    remove: function(prop) {
        delete this.syncObject[prop];
    },

    /**
     * @param {string} prop
     * @param {*} value
     */
    set: function(prop, value) {
        this.syncObject[prop] = value;
    },

    /**
     *
     * @param syncObject
     */
    setSyncObject: function(syncObject) {
        this.syncObject = syncObject;
        this.dispatchEvent(new Event(SyncObject.EventTypes.CHANGED));
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
SyncObject.EventTypes = {
    CHANGED: "changed"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbug.SyncObject', SyncObject);
