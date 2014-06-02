/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcli.CliAction')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugcli.CliFlag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var TypeUtil    = bugpack.require('TypeUtil');
    var CliFlag     = bugpack.require('bugcli.CliFlag');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CliFlag}
     */
    var CliAction = Class.extend(CliFlag, {

        _name: "bugcli.CliAction",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} cliActionObject
         */
        _constructor: function(cliActionObject) {

            this._super(cliActionObject);


            //-------------------------------------------------------------------------------
            // Private Properties
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
});
