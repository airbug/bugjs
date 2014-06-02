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

//@Export('bugrequest.RequestContextBuilder')
//@Autoload

//@Require('Class')
//@Require('List')
//@Require('Obj')
//@Require('bugcall.IncomingRequest')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugrequest.IBuildRequestContext')
//@Require('bugrequest.IPreProcessRequest')
//@Require('bugrequest.RequestContext')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var List                    = bugpack.require('List');
    var Obj                     = bugpack.require('Obj');
    var IncomingRequest         = bugpack.require('bugcall.IncomingRequest');
    var BugFlow                 = bugpack.require('bugflow.BugFlow');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var IBuildRequestContext    = bugpack.require('bugrequest.IBuildRequestContext');
    var IPreProcessRequest      = bugpack.require('bugrequest.IPreProcessRequest');
    var RequestContext          = bugpack.require('bugrequest.RequestContext');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;
    var $iterableSeries         = BugFlow.$iterableSeries;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IPreProcessRequest}
     */
    var RequestContextBuilder = Class.extend(Obj, {

        _name: "bugrequest.RequestContextBuilder",


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
             * @type {List.<IBuildRequestContext>}
             */
            this.requestContextBuilderList  = new List();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {IBuildRequestContext} requestContextBuilder
         */
        registerRequestContextBuilder: function(requestContextBuilder) {
            if (Class.doesImplement(requestContextBuilder, IBuildRequestContext)) {
                if (!this.requestContextBuilderList.contains(requestContextBuilder)) {
                    this.requestContextBuilderList.add(requestContextBuilder);
                } else {
                    throw new Error("requestContextBuilder can only be registered once.");
                }
            } else {
                throw new Error("requestContextBuilder does not implement IBuildRequestContext");
            }
        },


        //-------------------------------------------------------------------------------
        // IPreProcessRequest Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {*} request
         * @param {*} responder
         * @param {function(Throwable=)} callback
         */
        preProcessRequest: function(request, responder, callback) {
            this.buildRequestContext(request, function(throwable, requestContext) {
                if (!throwable) {
                    request.requestContext  = requestContext;
                }
                callback(throwable);
            });
        },


        //-------------------------------------------------------------------------------
        // Express Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} req
         * @param {*} res
         * @param {function()} next
         */
        buildRequestContextForExpress: function(req, res, next) {
            this.buildRequestContext(req, function(throwable, requestContext) {
                if (!throwable) {
                    req.requestContext = requestContext;
                    next();
                } else {
                    console.log(throwable.message);
                    console.log(throwable.stack);
                    throw throwable;
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {*} request
         * @param {function(Throwable, RequestContext=)} callback
         */
        buildRequestContext: function(request, callback) {
            var requestContext = new RequestContext(request);
            $iterableSeries(this.requestContextBuilderList, function(flow, requestContextBuilder) {
                requestContextBuilder.buildRequestContext(requestContext, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
                if (!throwable) {
                    callback(null, requestContext);
                } else {
                    callback(throwable);
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(RequestContextBuilder, IPreProcessRequest);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RequestContextBuilder).with(
        module("requestContextBuilder")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugrequest.RequestContextBuilder', RequestContextBuilder);
});
