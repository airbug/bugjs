//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugflow')

//@Export('MappedParallelException')

//@Require('Class')
//@Require('Map')
//@Require('bugflow.ParallelException')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var ParallelException   = bugpack.require('bugflow.ParallelException');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MappedParallelException = Class.extend(ParallelException, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function() {

        this._super("MappedParallelException", {}, "");


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<*, Throwable>}
         */
        this.causeMap   = new Map();
    },


    //-------------------------------------------------------------------------------
    // Throwable  Overrides
    //-------------------------------------------------------------------------------

    /**
     * @return {Array<Throwable>}
     */
    getCauses: function() {
        return this.causeMap.getValueArray();
    },

    /**
     * @return {Map.<*, Throwable>}
     */
    getCauseMap: function() {
        return this.causeMap;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Extension
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        var data = this._super();
        data.causeMap = this.causeMap.toObject();
        return data;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} key
     * @param {Throwable} throwable
     */
    putCause: function(key, throwable) {
        this.causeMap.put(key, throwable);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugflow.MappedParallelException', MappedParallelException);
