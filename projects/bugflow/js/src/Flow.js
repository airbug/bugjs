//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('Flow')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('Flow');

var Class = bugpack.require('Class');
var Event = bugpack.require('Event');
var EventDispatcher = bugpack.require('EventDispatcher');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Flow = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(callback) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function()}
         */
        this.callback = callback;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    complete: function() {
        if (this.callback) {
            this.callback();
        }
        this.dispatchEvent(new Event(Flow.EventType.COMPLETE));
    },

    /**
     * @abstract
     */
    execute: function() {
        // abstract
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
Flow.EventType = {
    COMPLETE: "Task:Complete"
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(Flow);