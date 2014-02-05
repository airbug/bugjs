//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('PersistedCallFactory')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.PersistedCall')
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
var PersistedCall               = bugpack.require('bugcall.PersistedCall');
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
var PersistedCallFactory = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *      callUuid: string,
     *      reconnect: boolean,
     *      open: boolean
     * }} persistedCallData
     * @returns {PersistedCall}
     */
    buildPersistedCall: function(persistedCallData) {
        return new PersistedCall(persistedCallData.callUuid, persistedCallData.reconnect, persistedCallData.open);
    },

    /**
     * @param {string} callUuid
     * @param {boolean} reconnect
     * @param {boolean} open
     * @returns {PersistedCall}
     */
    factoryPersistedCall: function(callUuid, reconnect, open) {
        return new PersistedCall(callUuid, reconnect, open);
    },

    /**
     * @param {PersistedCall} persistedCall
     * @returns {{
     *      callUuid: string,
     *      reconnect: boolean,
     *      open: boolean
     * }}
     */
    unbuildPersistedCall: function(persistedCall) {
        return {
            callUuid: persistedCall.getCallUuid(),
            open: persistedCall.getOpen(),
            reconnect: persistedCall.getReconnect()
        };
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(PersistedCallFactory).with(
    module("persistedCallFactory")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcall.PersistedCallFactory', PersistedCallFactory);
