//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcli')

//@Export('CliAction')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugcli.CliFlag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Obj =       bugpack.require('Obj');
var TypeUtil =  bugpack.require('TypeUtil');
var CliFlag =   bugpack.require('bugcli.CliFlag');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CliAction = Class.extend(CliFlag, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(cliActionObject) {

        this._super(cliActionObject);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.default = false;

        /**
         * @private
         * @type {function(Map.<string, *>, function(Error))}
         */
        this.executeMethod = null;

        /**
         * @private
         * @type {function(Map.<string, *>, function(Error))}
         */
        this.validateMethod = null;

        //TODO BRN: We should replace this with the BugMarshaller

        if (TypeUtil.isObject(cliActionObject)) {
            if (TypeUtil.isBoolean(cliActionObject.default)) {
                this.default = cliActionObject.default;
            }
            if (TypeUtil.isFunction(cliActionObject.executeMethod)) {
                this.executeMethod = cliActionObject.executeMethod;
            }
            if (TypeUtil.isFunction(cliActionObject.validateMethod)) {
                this.validateMethod = cliActionObject.validateMethod;
            }
        }
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    getDefault: function() {
        return this.default;
    },

    /**
     * @return {function(Map.<string, *>, function(Error))}
     */
    getExecuteMethod: function() {
        return this.executeMethod;
    },

    /**
     * @return {function(Map.<string, *>, function(Error))}
     */
    getValidateMethod: function() {
        return this.validateMethod;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcli.CliAction', CliAction);
