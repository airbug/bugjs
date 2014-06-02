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

//@Export('bugcall.CallRequestFactory')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.CallRequest')
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
    var CallRequest     = bugpack.require('bugcall.CallRequest');
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
    var CallRequestFactory = Class.extend(Obj, {

        _name: "bugcall.CallRequestFactory",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {{
         *      type: string,
         *      data: *,
         *      uuid: string
         * }} callRequestData
         * @return {CallRequest}
         */
        buildCallRequest: function(callRequestData) {
            var callRequest = this.factoryCallRequest(callRequestData.type, callRequestData.data);
            callRequest.setUuid(callRequestData.uuid);
            return callRequest;
        },

        /**
         * @param {string} requestType
         * @param {Object} requestData
         * @return {CallRequest}
         */
        factoryCallRequest: function(requestType, requestData) {
            return new CallRequest(requestType, requestData);
        },

        /**
         * @param {CallRequest} callRequest
         * @returns {{
         *      data: string,
         *      type: *,
         *      uuid: string
         * }}
         */
        unbuildCallRequest: function(callRequest) {
            return {
                data: callRequest.getData(),
                type: callRequest.getType(),
                uuid: callRequest.getUuid()
            };
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CallRequestFactory).with(
        module("callRequestFactory")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallRequestFactory', CallRequestFactory);
});
