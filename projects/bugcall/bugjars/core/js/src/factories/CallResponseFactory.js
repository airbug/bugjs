//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallResponseFactory')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.CallResponse')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var CallResponse                = bugpack.require('bugcall.CallResponse');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var module                      = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var CallResponseFactory = Class.extend(Obj, {

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

bugmeta.annotate(CallResponseFactory).with(
    module("callResponseFactory")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallResponseFactory', CallResponseFactory);
