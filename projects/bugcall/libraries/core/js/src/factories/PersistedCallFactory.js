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

//@Export('bugcall.PersistedCallFactory')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.PersistedCall')
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
    var PersistedCall   = bugpack.require('bugcall.PersistedCall');
    var ModuleTag       = bugpack.require('bugioc.ModuleTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var module          = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var PersistedCallFactory = Class.extend(Obj, {

        _name: "bugcall.PersistedCallFactory",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {{
         *      callType: string,
         *      callUuid: string,
         *      reconnect: boolean,
         *      open: boolean
         * }} persistedCallData
         * @returns {PersistedCall}
         */
        buildPersistedCall: function(persistedCallData) {
            return new PersistedCall(persistedCallData.callType, persistedCallData.callUuid, persistedCallData.reconnect, persistedCallData.open);
        },

        /**
         * @param {string} callType
         * @param {string} callUuid
         * @param {boolean} reconnect
         * @param {boolean} open
         * @returns {PersistedCall}
         */
        factoryPersistedCall: function(callType, callUuid, reconnect, open) {
            return new PersistedCall(callType, callUuid, reconnect, open);
        },

        /**
         * @param {PersistedCall} persistedCall
         * @returns {{
         *      callType: string,
         *      callUuid: string,
         *      open: boolean,
         *      reconnect: boolean
         * }}
         */
        unbuildPersistedCall: function(persistedCall) {
            return {
                callType: persistedCall.getCallType(),
                callUuid: persistedCall.getCallUuid(),
                open: persistedCall.getOpen(),
                reconnect: persistedCall.getReconnect()
            };
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(PersistedCallFactory).with(
        module("persistedCallFactory")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.PersistedCallFactory', PersistedCallFactory);
});
