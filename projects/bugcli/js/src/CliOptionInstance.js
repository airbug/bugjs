//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcli')

//@Export('CliOptionInstance')

//@Require('Class')
//@Require('Obj')
//@Require('bugcli.CliFlagInstance')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Obj =               bugpack.require('Obj');
var CliFlagInstance =   bugpack.require('bugcli.CliFlagInstance');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CliOptionInstance = Class.extend(CliFlagInstance, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(cliOption) {

        this._super(cliOption);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CliOption}
         */
        this.cliOption = cliOption;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CliOption}
     */
    getCliOption: function() {
        return this.cliOption;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, CliOptionInstance)) {
            return Obj.equals(this.cliOption, value.getCliOption());
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[CliOptionInstance]" +
                Obj.hashCode(this.cliOption));
        }
        return this._hashCode;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcli.CliOptionInstance', CliOptionInstance);
