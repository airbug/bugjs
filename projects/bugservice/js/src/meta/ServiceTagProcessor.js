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

//@Export('bugservice.ServiceTagProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('bugmeta.ITagProcessor')
//@Require('bugservice.ServiceRoute')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var ITagProcessor   = bugpack.require('bugmeta.ITagProcessor');
    var ServiceRoute    = bugpack.require('bugservice.ServiceRoute');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {ITagProcessor}
     */
    var ServiceTagProcessor = Class.extend(Obj, {

        _name: "bugservice.ServiceTagProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ServiceController} controller
         */
        _constructor: function(controller) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ServiceController}
             */
            this.controller  = controller;
        },


        //-------------------------------------------------------------------------------
        // ITagProcessor Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Tag} tag
         */
        process: function(tag) {
            this.processServiceTag(/** @type {ServiceTag} */(tag));
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {*} service
         * @param {string} methodName
         * @param {List.<string>} paramList
         * @return {ServiceRoute}
         */
        factoryServiceRoute: function(service, methodName, paramList) {
            return new ServiceRoute(service, methodName, paramList);
        },

        /**
         * @private
         * @param {ServiceTag} serviceTag
         */
        processServiceTag: function(serviceTag) {
            var _this               = this;
            var serviceConstructor = serviceTag.getTagReference();
            //TODO BRN: How do we generate the service here? Seems like we need to reach in to the application context.
            //var service =



            var methodTagList = serviceTag.getMethodList();
            methodTagList.forEach(function(methodTag) {
                var serviceRoute = _this.factoryServiceRoute();
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(ServiceTagProcessor, ITagProcessor);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugservice.ServiceTagProcessor', ServiceTagProcessor);
});
