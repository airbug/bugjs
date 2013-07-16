//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugatomic')

//@Export('ILockOperator')

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

var ILockOperator = Interface.declare({

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} key
     * @param {string} type
     * @param {function(Lock} callback
     */
    acquireLock: function(key, type, callback) {},

    /**
     * @param {string} key
     * @param {string} type
     * @return {boolean}
     */
    isLockedForType: function(key, type) {},

    /**
     * @param {string} key
     * @param {string} type
     */
    releaseLock: function(key, type) {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugatomic.ILockOperator', ILockOperator);
