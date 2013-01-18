//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IHashCode')

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

var IHashCode = Interface.declare({

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    hashCode: function() {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('IHashCode', IHashCode);
