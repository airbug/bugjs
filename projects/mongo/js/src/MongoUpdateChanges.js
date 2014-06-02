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

//@Export('mongo.MongoUpdateChanges')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Map             = bugpack.require('Map');
    var Obj             = bugpack.require('Obj');
    var Set             = bugpack.require('Set');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MongoUpdateChanges = Class.extend(Obj, {

        _name: "mongo.MongoUpdateChanges",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<string, *>}
             */
            this.addToSetChangeMap  = new Map();

            /**
             * @private
             * @type {Map.<string, *>}
             */
            this.pullChangeMap      = new Map();

            /**
             * @private
             * @type {Map.<string, *>}
             */
            this.setChangeMap       = new Map();

            /**
             * @private
             * @type {Set.<string>}
             */
            this.unsetChangeSet     = new Set();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} key
         */
        addUnsetChange: function(key) {
            if (key === "id" || key === "_id") return;

            if (!this.setChangeMap.containsKey(key)) {
                this.unsetChangeSet.add(key);
            } else {
                throw new Error("Cannot 'set' and 'unset' the same key");
            }
        },

        /**
         * @return {Object}
         */
        buildUpdateObject: function() {
            var updates = {};
            if (!this.setChangeMap.isEmpty()) {
                updates.$set = {};
                this.setChangeMap.forEach(function(value, key) {
                    updates.$set[key] = value;
                });
            }
            if (!this.unsetChangeSet.isEmpty()) {
                updates.$unset = {};
                this.unsetChangeSet.forEach(function(key) {
                    updates.$unset[key] = "";
                });
            }
            if (!this.addToSetChangeMap.isEmpty()) {
                updates.$addToSet = {};
                this.addToSetChangeMap.forEach(function(value, key) {
                    if (updates.$addToSet[key]){
                        updates.$addToSet[key].$each.push(value);
                    } else {
                        updates.$addToSet[key] = {$each: [value]};
                    }
                });
            }
            if (!this.pullChangeMap.isEmpty()) {
                updates.$pullAll = {};
                this.pullChangeMap.forEach(function(value, key) {
                    if (updates.$pullAll[key]) {
                        updates.$pullAll[key].push(value);
                    } else {
                        updates.$pullAll[key] = [value];
                    }
                });
            }
            return updates;
        },

        /**
         * @param {string} key
         * @param {*} value
         */
        putAddToSetChange: function(key, value) {
            if (key === "id" || key === "_id") return;

            this.addToSetChangeMap.put(key, value);
        },

        /**
         * @param {string} key
         * @param {*} value
         */
        putPullChange: function(key, value) {
            if (key === "id" || key === "_id") return;

            this.pullChangeMap.put(key, value);
        },

        /**
         * @param {string} key
         * @return {boolean}
         */
        containsSetChange: function(key) {
            return this.setChangeMap.containsKey(key);
        },

        /**
         * @param {string} key
         * @param {*} value
         */
        putSetChange: function(key, value) {
            if (key === "id" || key === "_id") return;

            if (!this.unsetChangeSet.contains(key)) {
                this.setChangeMap.put(key, value);
            } else {
                throw new Error("Cannot 'set' and 'unset' the same key");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('mongo.MongoUpdateChanges', MongoUpdateChanges);
});
