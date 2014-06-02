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

//@Export('bugmessage.Message')

//@Require('Class')
//@Require('IObjectable')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('UuidGenerator')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var IObjectable     = bugpack.require('IObjectable');
    var Map             = bugpack.require('Map');
    var Obj             = bugpack.require('Obj');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Message = Class.extend(Obj, {

        _name: "bugmessage.Message",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} type
         * @param {Object} data
         */
        _constructor: function(type, data) {

            this._super();

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.data = data;

            /**
             * @private
             * @type {Map.<string, *>}
             */
            this.headerMap = new Map();

            /**
             * @private
             * @type {string}
             */
            this.type = TypeUtil.isString(type) ? type : "";
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        getData: function() {
            return this.data;
        },

        /**
         * @param {string} name
         * @return {*}
         */
        getHeader: function(name) {
            return this.headerMap.get(name);
        },

        /**
         * @param {string} name
         * @param {*} header
         */
        setHeader: function(name, header) {
            this.headerMap.put(name, header);
        },

        /**
         * @return {string}
         */
        getType: function() {
            return this.type;
        },


        //-------------------------------------------------------------------------------
        // Class Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        toObject: function() {
            var _this = this;
            var headerMapObject = {};
            this.headerMap.getKeyArray().forEach(function(name) {
                var header = _this.headerMap.get(name);
                headerMapObject[name] = header;
            });
            return {
                data: this.data,
                headerMap: headerMapObject,
                type: this.type
            };
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugmessage.Message', Message);
});
