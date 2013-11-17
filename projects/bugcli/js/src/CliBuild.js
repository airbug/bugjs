//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcli')

//@Export('CliBuild')

//@Require('Class')
//@Requite('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Map =       bugpack.require('Map');
var Obj =       bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CliBuild = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CliActionInstance}
         */
        this.cliActionInstance = null;

        /**
         * @private
         * @type {Map.<string, CliOptionInstance>}
         */
        this.cliOptionInstanceMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     *
     * @return {CliActionInstance}
     */
    getCliActionInstance: function() {
        return this.cliActionInstance;
    },

    /**
     * @param {CliActionInstance} cliActionInstance
     */
    setCliActionInstance: function(cliActionInstance) {
        this.cliActionInstance = cliActionInstance;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {CliOptionInstance} cliOptionInstance
     */
    addCliOptionInstance: function(cliOptionInstance) {
        this.cliOptionInstanceMap.put(cliOptionInstance.getCliOption().getName(), cliOptionInstance);
    },

    /**
     * @return {CliActionInstance}
     */
    getAction: function() {
        return this.cliActionInstance;
    },

    /**
     * @param {string} optionName
     * @return {CliOptionInstance}
     */
    getOption: function(optionName) {
        return this.getCliOptionInstance(optionName);
    },

    /**
     * @return {CliOptionInstance}
     */
    getCliOptionInstance: function(optionName) {
        return this.cliOptionInstanceMap.get(optionName);
    },

    /**
     * @return {boolean}
     */
    hasCliActionInstance: function() {
        return this.cliActionInstance !== null;
    },

    /**
     * @param {CliOptionInstance} cliOptionInstance
     * @return {boolean}
     */
    hasCliOptionInstance: function(cliOptionInstance) {
        return this.cliOptionInstanceMap.containsValue(cliOptionInstance);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcli.CliBuild', CliBuild);
