//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcli.CliActionInstance')

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

var CliActionInstance = Class.extend(CliFlagInstance, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(cliAction) {

        this._super(cliAction);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CliAction}
         */
        this.cliAction = cliAction;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CliAction}
     */
    getCliAction: function() {
        return this.cliAction;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, CliActionInstance)) {
            return Obj.equals(this.cliAction, value.getCliAction());
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[CliActionInstance]" +
                Obj.hashCode(this.cliAction));
        }
        return this._hashCode;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcli.CliActionInstance', CliActionInstance);
