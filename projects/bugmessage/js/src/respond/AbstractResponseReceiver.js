//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmessage')

//@Export('AbstractResponseReceiver')

//@Require('Class')
//@Require('EventPropagator')
//@Require('bugmessage.IResponseReceiver')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventPropagator     = bugpack.require('EventPropagator');
var IResponseReceiver   = bugpack.require('bugmessage.IResponseReceiver');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AbstractResponseReceiver = Class.extend(EventPropagator, {

    /**
     * @abstract
     */
    //doCloseReceiver: function() {},

    /**
     * @abstract
     * @param {Response} response
     */
    //doReceiveResponse: function(message, messageResponder) {},


    //-------------------------------------------------------------------------------
    // IResponseReceiver Implementation
    //-------------------------------------------------------------------------------

    closeReceiver: function() {
        this.doCloseReceiver();
    },

    /**
     * @param {Response} response
     */
    receiveResponse: function(response) {
        this.doReceiveResponse(response);
    }
});



//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(AbstractResponseReceiver, IResponseReceiver);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugmessage.AbstractResponseReceiver', AbstractResponseReceiver);
