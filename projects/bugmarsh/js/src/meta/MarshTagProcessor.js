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

//@Export('bugmarsh.MarshTagProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('bugmarsh.Marsh')
//@Require('bugmarsh.MarshProperty')
//@Require('bugmeta.ITagProcessor')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var Marsh           = bugpack.require('bugmarsh.Marsh');
    var MarshProperty   = bugpack.require('bugmarsh.MarshProperty');
    var ITagProcessor   = bugpack.require('bugmeta.ITagProcessor');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {ITagProcessor}
     */
    var MarshTagProcessor = Class.extend(Obj, {

        _name: "bugmarsh.MarshTagProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MarshRegistry} marshRegistry
         */
        _constructor: function(marshRegistry) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MarshRegistry}
             */
            this.marshRegistry = marshRegistry;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {MarshRegistry}
         */
        getMarshRegistry: function() {
            return this.marshRegistry;
        },


        //-------------------------------------------------------------------------------
        // ITagProcessor Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Tag} tag
         */
        process: function(tag) {
            this.processMarshTag(/** @type {MarshTag} */(tag));
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Class} marshClass
         * @param {string} marshName
         * @return {Marsh}
         */
        factoryMarsh: function(marshClass, marshName) {
            return new Marsh(marshClass, marshName);
        },

        /**
         * @private
         * @param {string} propertyName
         * @param {string} getterName
         * @param {string} setterName
         * @return {MarshProperty}
         */
        factoryMarshProperty: function(propertyName, getterName, setterName) {
            return new MarshProperty(propertyName, getterName, setterName);
        },

        /**
         * @private
         * @param {MarshTag} marshTag
         */
        processMarshTag: function(marshTag) {
            var _this               = this;
            var marshConstructor    = marshTag.getTagReference();
            var marshClass          = marshConstructor.getClass();
            var marshName           = marshTag.getMarshName();
            if (!this.marshRegistry.hasMarshForClass(marshClass) && !this.marshRegistry.hasMarshForName(marshName)) {
                var marsh = this.factoryMarsh(marshClass, marshName);
                marshTag.getMarshProperties().forEach(function(propertyTag) {
                    var marshProperty = _this.factoryMarshProperty(propertyTag.getPropertyName(),
                        propertyTag.getGetterName(), propertyTag.getSetterName());
                    marsh.addProperty(marshProperty);
                });
                this.marshRegistry.registerMarsh(marsh);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(MarshTagProcessor, ITagProcessor);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmarsh.MarshTagProcessor', MarshTagProcessor);
});
