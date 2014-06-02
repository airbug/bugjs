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

//@Export('bugroute.BugCallRouter')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('Exception')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugrequest.IProcessRequest')
//@Require('bugroute.BugCallRoute')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil             = bugpack.require('ArgUtil');
    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var Map                 = bugpack.require('Map');
    var Obj                 = bugpack.require('Obj');
    var TypeUtil            = bugpack.require('TypeUtil');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var IProcessRequest     = bugpack.require('bugrequest.IProcessRequest');
    var BugCallRoute        = bugpack.require('bugroute.BugCallRoute');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IProcessRequest}
     */
    var BugCallRouter = Class.extend(Obj, {

        _name: "bugroute.BugCallRouter",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function(){

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<string, ICallRoute>}
             */
            this.routeMap      = new Map();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @returns {Array.<ICallRoute>}
         */
        getRouteArray: function() {
            return this.routeMap.getValueArray();
        },

        /**
         * @returns {Map.<string, ICallRoute>}
         */
        getRouteMap: function() {
            return this.routeMap;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {ICallRoute} route
         */
        add: function(route) {
            var requestType = route.getRequestType();
            if (!this.routeMap.containsKey(requestType)) {
                this.routeMap.put(requestType, route);
            } else {
                throw new Error("The bugCallRoute '" + requestType + "' already exists in the routeMap");
            }
        },

        /**
         * @param {(Array.<ICallRoute> | {})} routes
         */
        addAll: function(routes) {
            var _this = this;
            if (TypeUtil.isArray(routes)) {
                routes.forEach(function(route) {
                    _this.add(route);
                });
            } else if (TypeUtil.isObject(routes)) {
                Obj.forIn(routes, function(requestType, listener) {
                    if (TypeUtil.isFunction(listener)) {
                        _this.add(new BugCallRoute(requestType, listener));
                    }
                });
            } else {
                var args = ArgUtil.toArray(arguments);
                this.addAll(args);
            }
        },


        //-------------------------------------------------------------------------------
        // IProcessRequest Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {*} request
         * @param {*} responder
         * @param {function(Throwable=)} callback
         */
        processRequest: function(request, responder, callback) {
            var requestType     = request.getType();
            var bugCallRoute    = this.routeMap.get(requestType);
            if (bugCallRoute) {
                bugCallRoute.route(request, responder, callback);
            } else {
                callback(new Exception("NoRouteFound", {}, "Route '" + requestType + "' does not exist"));
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(BugCallRouter, IProcessRequest);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(BugCallRouter).with(
        module("bugCallRouter")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugroute.BugCallRouter', BugCallRouter);
});
