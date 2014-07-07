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

//@Export('bugioc.AutowiredTagProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
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
    var Set             = bugpack.require('Set');
    var ITagProcessor   = bugpack.require('bugmeta.ITagProcessor');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {ITagProcessor}
     */
    var AutowiredTagProcessor = Class.extend(Obj, {

        _name: "bugioc.AutowiredTagProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IocContext} iocContext
         */
        _constructor: function(iocContext) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {IocContext}
             */
            this.iocContext                         = iocContext;

            /**
             * @private
             * @type {Set.<AutowiredTag>}
             */
            this.processedAutowiredTagSet    = new Set();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {AutowiredTag} autowiredTag
         */
        process: function(autowiredTag) {
            this.processAutowiredTag(autowiredTag);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {AutowiredTag} autowiredTag
         */
        processAutowiredTag: function(autowiredTag) {
            var _this   = this;
            if (!this.processedAutowiredTagSet.contains(autowiredTag)) {
                var autowiredConstructor    = autowiredTag.getTagReference();
                var propertyTagArray        = autowiredTag.getAutowiredProperties();
                var currentConstructor      = autowiredConstructor.prototype._constructor;
                autowiredConstructor.prototype._constructor = function() {
                    var instance = this;
                    currentConstructor.apply(this, arguments);
                    propertyTagArray.forEach(function(propertyTag) {
                        if (propertyTag.getPropertyRef()) {
                            instance[propertyTag.getPropertyName()] = _this.iocContext.generateModuleByName(propertyTag.getPropertyRef()).getInstance();
                        } else {
                            instance[propertyTag.getPropertyName()] = propertyTag.getPropertyValue();
                        }
                    });
                };
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(AutowiredTagProcessor, ITagProcessor);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.AutowiredTagProcessor', AutowiredTagProcessor);
});
