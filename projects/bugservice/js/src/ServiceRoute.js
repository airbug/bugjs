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

//@Export('bugservice.ServiceRoute')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugroute.ICallRoute')
//@Require('bugservice.ServiceContext')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var ArgUtil         = bugpack.require('ArgUtil');
    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var Obj             = bugpack.require('Obj');
    var ICallRoute      = bugpack.require('bugroute.ICallRoute');
    var ServiceContext  = bugpack.require('bugservice.ServiceContext');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ServiceRoute = Class.extend(Obj, {

        _name: "bugservice.ServiceRoute",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {*} service
         * @param {string} methodName
         * @param {List.<string>} paramList
         */
        _constructor: function(service, methodName, paramList) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.methodName = methodName;

            /**
             * @private
             * @type {List.<string>}
             */
            this.paramList  = paramList;

            /**
             * @private
             * @type {*}
             */
            this.service    = service;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getMethodName: function() {
            return this.methodName;
        },

        /**
         * @return {List.<string>}
         */
        getParamList: function() {
            return this.paramList;
        },

        /**
         * @return {*}
         */
        getService: function() {
            return this.service;
        },


        //-------------------------------------------------------------------------------
        // ICallRoute Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {CallRequest} request
         * @param {CallResponder} responder
         */
        route: function(request, responder) {
            var _this = this;
            var data            = request.getData();
            var serviceContext  = this.factoryServiceContext(request.getCall());
            var args = [serviceContext];
            this.paramList.forEach(function(param) {
                args.push(data[param]);
            });
            args.push(function() {
                var args    = ArgUtil.toArray(arguments);
                var error   = args[0];

                //TODO BRN: How do we handle other returned args?

                var data        = null;
                var response    = null;
                if (!error) {
                    response    = responder.response(_this.methodName + "Response", data);
                } else {
                    if (Class.doesExtend(error, Exception)) {
                        var exception = error;
                        data        = {
                            exception: exception.toObject()
                        };
                        response    = responder.response(_this.methodName + "Exception", data);
                    } else {
                        //TODO BRN: This should not be sent out if we are in prod mode
                        data    = {
                            error: error.message
                        };
                        response    = responder.response(_this.methodName + "Error", data);
                    }
                }
                responder.sendResponse(response, function(error) {
                    //TODO BRN: Handle an unsuccessfully sent response
                });
            });
            var serviceMethod = this.service[this.methodName];
            serviceMethod.apply(this.service, args);
        },

        /**
         * @return {string}
         */
        getRequestType: function() {
            return this.getMethodName();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {CallRequest} request
         * @return {ServiceContext}
         */
        factoryServiceContext: function(request) {
            return new ServiceContext(request.getCall());
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(ServiceRoute, ICallRoute);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugservice.ServiceRoute', ServiceRoute);
});
