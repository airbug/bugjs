//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('IConfiguration')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Interface = bugpack.require('Interface');


//-------------------------------------------------------------------------------
// Declare Interface
//-------------------------------------------------------------------------------

var IConfiguration = Interface.declare({

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)}
     */
    initializeConfiguration: function(callback) {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.IConfiguration', IConfiguration);
