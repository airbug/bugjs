//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IDocument')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Interface           = bugpack.require('Interface');


//-------------------------------------------------------------------------------
// Declare Interface
//-------------------------------------------------------------------------------

/**
 * @interface
 */
var IDocument = Interface.declare({

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getData: function() {},

    /**
     * @param {*} data
     */
    setData: function(data) {},

    /**
     * @param {string} path
     * @return {*}
     */
    getPath: function(path) {},

    /**
     * @param {string} path
     * @param {*} value
     */
    setPath: function(path, value) {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('IDocument', IDocument);