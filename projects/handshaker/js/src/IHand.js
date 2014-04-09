//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('handshaker.IHand')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack Modules
//-------------------------------------------------------------------------------

var Interface           = bugpack.require('Interface');


//-------------------------------------------------------------------------------
// Declare Interface
//-------------------------------------------------------------------------------

var IHand = Interface.declare({

    /**
     * @param {{
     *    headers: Object,
     *    time: Date,
     *    address: Object,
     *    xdomain: boolean,
     *    secure: boolean,
     *    issued: number,
     *    url: string,
     *    query: Object
     * }} handshakeData
     * @param {function(Throwable, boolean)} callback
     */
    shakeIt: function(handshakeData, callback) {}

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('handshaker.IHand', IHand);
