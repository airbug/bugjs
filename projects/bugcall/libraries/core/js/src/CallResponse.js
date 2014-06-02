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

//@Export('bugcall.CallResponse')

//@Require('Class')
//@Require('IObjectable')
//@Require('Obj')
//@Require('UuidGenerator')
//@Require('bugmarsh.MarshTag');
//@Require('bugmarsh.MarshPropertyTag');
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var IObjectable         = bugpack.require('IObjectable');
    var Obj                 = bugpack.require('Obj');
    var UuidGenerator       = bugpack.require('UuidGenerator');
    var MarshPropertyTag    = bugpack.require('bugmarsh.MarshPropertyTag');
    var MarshTag            = bugpack.require('bugmarsh.MarshTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var marsh               = MarshTag.marsh;
    var property            = MarshPropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IObjectable}
     */
    var CallResponse = Class.extend(Obj, {

        _name: "bugcall.CallResponse",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} type
         * @param {*} data
         * @param {string} requestUuid
         */
        _constructor: function(type, data, requestUuid) {

            this._super();

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {*}
             */
            this.data           = data;

            /**
             * @private
             * @type {string}
             */
            this.requestUuid    = requestUuid;

            /**
             * @private
             * @type {string}
             */
            this.type           = type;

            /**
             * @private
             * @type {string}
             */
            this.uuid           = UuidGenerator.generateUuid();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        getData: function() {
            return this.data;
        },

        /**
         * @return {string}
         */
        getRequestUuid: function() {
            return this.requestUuid
        },

        /**
         * @return {string}
         */
        getType: function() {
            return this.type;
        },

        /**
         * @return {string}
         */
        getUuid: function() {
            return this.uuid;
        },


        //-------------------------------------------------------------------------------
        // IObjectable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {{requestUuid: string, type: string, data: *, uuid: string}}
         */
        toObject: function() {
            return {
                requestUuid: this.getRequestUuid(),
                type: this.getType(),
                data: this.getData(),
                uuid: this.getUuid()
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(CallResponse, IObjectable);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CallResponse).with(
        marsh("CallResponse")
            .properties([
                property("data"),
                property("requestUuid"),
                property("type"),
                property("uuid")
            ])
    );


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallResponse', CallResponse);
});
