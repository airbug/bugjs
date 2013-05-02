//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcli')

//@Export('CliFlag')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugcli.CliParameter')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =         bugpack.require('Class');
var List =          bugpack.require('List');
var Map =           bugpack.require('Map');
var Obj =           bugpack.require('Obj');
var Set =           bugpack.require('Set');
var TypeUtil =      bugpack.require('TypeUtil');
var CliParameter =  bugpack.require('bugcli.CliParameter');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CliFlag = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(cliFlagObject) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Set.<string>}
         */
        this.flagSet = new Set();

        /**
         * @private
         * @type {string}
         */
        this.name = "";

        /**
         * @private
         * @type {List.<CliParameter>}
         */
        this.cliParameterList = new List();

        /**
         * @private
         * @type {Map.<string, CliParameter>}
         */
        this.cliParameterMap = new Map();

        //TODO BRN: We should replace this with the BugMarshaller

        var _this = this;
        if (TypeUtil.isObject(cliFlagObject)) {
            if (TypeUtil.isString(cliFlagObject.name)) {
                this.name = cliFlagObject.name;
            }
            if (TypeUtil.isArray(cliFlagObject.flags)) {
                cliFlagObject.flags.forEach(function(flag) {
                    if (TypeUtil.isString(flag)) {
                        _this.flagSet.add(flag);
                    }
                });
            }
            if (TypeUtil.isArray(cliFlagObject.parameters)) {
                cliFlagObject.parameters.forEach(function(parameterObject) {

                    //TODO BRN: We should replace this with the BugMarshaller

                    var cliParameter = new CliParameter(parameterObject);
                    _this.cliParameterList.add(cliParameter);
                    _this.cliParameterMap.put(cliParameter.getName(), cliParameter);
                });
            }
        }
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Set.<string>}
     */
    getFlagSet: function() {
        return this.flagSet;
    },

    /**
     * @return {string}
     */
    getName: function() {
        return this.name;
    },

    /**
     * @return {List.<CliParameter>}
     */
    getCliParameterList: function() {
        return this.cliParameterList;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} parameterName
     * @return {CliParameter}
     */
    getCliParameterByName: function(parameterName) {
        return this.cliParameterMap.get(parameterName);
    },

    /**
     * @return {boolean}
     */
    hasParameters: function() {
        return !this.cliParameterMap.isEmpty();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcli.CliFlag', CliFlag);
