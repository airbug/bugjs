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

//@Export('bugcall.CallResponseFactory')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.CallResponse')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var CallResponse    = bugpack.require('bugcall.CallResponse');
    var ArgTag          = bugpack.require('bugioc.ArgTag');
    var ModuleTag       = bugpack.require('bugioc.ModuleTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg             = ArgTag.arg;
    var bugmeta         = BugMeta.context();
    var module          = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CallResponseFactory = Class.extend(Obj, {

        _name: "bugcall.CallResponseFactory",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {{
         *      data: *,
         *      requestUuid: string,
         *      type: string,
         *      uuid: string
         * }} callResponseData
         * @return {CallResponse}
         */
        buildCallResponse: function(callResponseData) {
            var callResponse = this.factoryCallResponse(callResponseData.type, callResponseData.data, callResponseData.requestUuid);
            callResponse.setUuid(callResponseData.uuid);
            return callResponse;
        },

        /**
         * @param {string} type
         * @param {*} data
         * @param {string} requestUuid
         * @return {CallResponse}
         */
        factoryCallResponse: function(type, data, requestUuid) {
            return new CallResponse(type, data, requestUuid);
        },

        /**
         * @param {CallResponse} callResponse
         * @returns {{
         *      data: string,
         *      requestUuid: string,
         *      type: *,
         *      uuid: string
         * }}
         */
        unbuildCallResponse: function(callResponse) {
            return {
                data: callResponse.getData(),
                requestUuid: callResponse.getRequestUuid(),
                type: callResponse.getType(),
                uuid: callResponse.getUuid()
            };
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CallResponseFactory).with(
        module("callResponseFactory")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallResponseFactory', CallResponseFactory);
});
