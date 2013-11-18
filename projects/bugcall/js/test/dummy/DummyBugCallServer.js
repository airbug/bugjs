//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('DummyBugCallServer')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('bugcall.CallEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack Modules
//-------------------------------------------------------------------------------


var Class                           = bugpack.require('Class');
var EventDispatcher                 = bugpack.require('EventDispatcher');
var CallEvent                       = bugpack.require('bugcall.CallEvent');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {EventDispatcher}
 */
var DummyBugCallServer = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} callManager
     */
    connect: function(callManager) {
        this.dispatchEvent(new CallEvent(CallEvent.OPENED, {
            callManager: callManager
        }));
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcall.DummyBugCallServer', DummyBugCallServer);
