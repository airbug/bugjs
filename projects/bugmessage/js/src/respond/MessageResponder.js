//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmessage.MessageResponder')

//@Require('Class')
//@Require('bugmessage.AbstractResponder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var AbstractResponder   = bugpack.require('bugmessage.AbstractResponder');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageResponder = Class.extend(AbstractResponder, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {Response} response
     * @param {function(Error)} callback
     */
    doSendResponse: function(response, callback) {
        response.setHeader("responseChannelUuid", this.getResponseChannel().getUuid());
        this.getResponseChannel().channelResponse(response);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugmessage.MessageResponder', MessageResponder);
