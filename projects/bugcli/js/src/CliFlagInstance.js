//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcli')

//@Export('CliFlagInstance')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugcli.CliParameterInstance')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var Map =                   bugpack.require('Map');
var Obj =                   bugpack.require('Obj');
var CliParameterInstance =  bugpack.require('bugcli.CliParameterInstance');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CliFlagInstance = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(cliFlag) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CliFlag}
         */
        this.cliFlag = cliFlag;

        /**
         * @private
         * @type {Map.<string, CliParameterInstance>}
         */
        this.cliParameterInstanceMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------


    /**
     * @param {string} parameterName
     * @param {string} value
     */
    addCliParameterInstance: function(parameterName, value) {
        var cliParameter = this.cliFlag.getCliParameterByName(parameterName);
        var cliParameterInstance = new CliParameterInstance(cliParameter, value);
        this.cliParameterInstanceMap.put(parameterName, cliParameterInstance);
    },

    /**
     * @param {string} parameterName
     * @return {boolean}
     */
    containsParameter: function(parameterName) {
        return this.cliParameterInstanceMap.containsKey(parameterName);
    },

    /**
     * @return {CliFlag}
     */
    getCliFlag: function() {
        return this.cliFlag;
    },

    /**
     * @param {string} parameterName
     * @return {CliParameterInstance}
     */
    getCliParameterInstance: function(parameterName) {
        return this.cliParameterInstanceMap.get(parameterName);
    },

    /**
     * @return {string}
     */
    getName: function() {
        return this.cliFlag.getName();
    },

    /**
     * @param {string} parameterName
     * @return {*}
     */
    getParameter: function(parameterName) {
        var cliParameterInstance = this.getCliParameterInstance(parameterName);
        if (cliParameterInstance) {
            return cliParameterInstance.getValue();
        }
        return null;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcli.CliFlagInstance', CliFlagInstance);
