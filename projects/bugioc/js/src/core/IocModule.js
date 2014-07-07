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

//@Export('bugioc.IocModule')

//@Require('Class')
//@Require('List')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var List    = bugpack.require('List');
    var Obj     = bugpack.require('Obj');
    var Set     = bugpack.require('Set');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var IocModule = Class.extend(Obj, {

        _name: "bugioc.IocModule",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} name
         * @param {IocModule.Scope} scope
         */
        _constructor: function(name, scope) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {List.<IocArg>}
             */
            this.iocArgList         = new List();

            /**
             * @private
             * @type {Set.<IocProperty>}
             */
            this.iocPropertySet     = new Set();

            /**
             * @private
             * @type {ModuleFactory}
             */
            this.moduleFactory      = undefined;

            /**
             * @private
             * @type {string}
             */
            this.name               = name;

            /**
             * @private
             * @type {IocModule.Scope}
             */
            this.scope              = scope ? scope : IocModule.Scope.SINGLETON;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {List.<IocArg>}
         */
        getIocArgList: function() {
            return this.iocArgList;
        },

        /**
         * @return {Set.<IocProperty>}
         */
        getIocPropertySet: function() {
            return this.iocPropertySet;
        },

        /**
         * @return {ModuleFactory}
         */
        getModuleFactory: function() {
            return this.moduleFactory;
        },

        /**
         * @param {ModuleFactory} moduleFactory
         */
        setModuleFactory: function(moduleFactory) {
            this.moduleFactory = moduleFactory;
        },

        /**
         * @return {string}
         */
        getName: function() {
            return this.name;
        },

        /**
         * @return {IocModule.Scope}
         */
        getScope: function() {
            return this.scope;
        },


        //-------------------------------------------------------------------------------
        // Object Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (Class.doesExtend(value, IocModule)) {
                return Obj.equals(value.getName(), this.getName());
            }
            return false;
        },

        /**
         * @return {number}
         */
        hashCode: function() {
            if (!this._hashCode) {
                this._hashCode = Obj.hashCode("[IocModule]" + Obj.hashCode(this.name));
            }
            return this._hashCode;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {IocArg} iocArg
         */
        addIocArg: function(iocArg) {
            if (!this.iocArgList.contains(iocArg)) {
                this.iocArgList.add(iocArg);
            } else {
                throw new Error("Module already contains this IocArg");
            }
        },

        /**
         * @param {IocProperty} iocProperty
         */
        addIocProperty: function(iocProperty) {
            if (!this.iocPropertySet.contains(iocProperty)) {
                this.iocPropertySet.add(iocProperty);
            } else {
                throw new Error("Module already contains this IocProperty");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @enum {string}
     */
    IocModule.Scope = {
        PROTOTYPE: "prototype",
        SINGLETON: "singleton"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.IocModule', IocModule);
});
