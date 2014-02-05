//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallRequestFactory')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.CallRequest')
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
var CallRequest                 = bugpack.require('bugcall.CallRequest');
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
var CallRequestFactory = Class.extend(Obj, {

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

bugmeta.annotate(CallRequestFactory).with(
    module("callRequestFactory")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallRequestFactory', CallRequestFactory);
