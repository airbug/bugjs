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

//@Export('bugrequest.RequestProcessor')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('Flows')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugrequest.IPreProcessRequest')
//@Require('bugrequest.IProcessRequest')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var Set                 = bugpack.require('Set');
    var Flows             = bugpack.require('Flows');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var IPreProcessRequest  = bugpack.require('bugrequest.IPreProcessRequest');
    var IProcessRequest     = bugpack.require('bugrequest.IProcessRequest');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;
    var $iterableSeries     = Flows.$iterableSeries;
    var $series             = Flows.$series;
    var $task               = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var RequestProcessor = Class.extend(Obj, {

        _name: "bugrequest.RequestProcessor",


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
             * @type {Set.<IPreProcessRequest>}
             */
            this.requestPreProcessorSet         = new Set();

            /**
             * @private
             * @type {Set.<IProcessRequest>}
             */
            this.requestProcessorSet            = new Set();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Set.<IPreProcessRequest>}
         */
        getRequestPreProcessorSet: function() {
            return this.requestPreProcessorSet;
        },

        /**
         * @return {Set.<IProcessRequest>}
         */
        getRequestProcessorSet: function() {
            return this.requestProcessorSet;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} request
         * @param {*} responder
         * @param {function(Throwable=)} callback
         */
        processRequest: function(request, responder, callback) {
            var _this           = this;
            $series([
                $task(function(flow) {
                    _this.doPreProcessRequest(request, responder, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.doProcessRequest(request, responder, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(callback);
        },

        /**
         * @param {IPreProcessRequest} requestPreProcessor
         * @throws {Error}
         */
        registerRequestPreProcessor: function(requestPreProcessor) {
            if (Class.doesImplement(requestPreProcessor, IPreProcessRequest)) {
                this.requestPreProcessorSet.add(requestPreProcessor);
            } else {
                throw new Error("requestPreProcessor must implement IPreProcessRequest");
            }
        },

        /**
         * @param {IProcessRequest} requestProcessor
         * @throws {Error}
         */
        registerRequestProcessor: function(requestProcessor) {
            if (Class.doesImplement(requestProcessor, IProcessRequest)) {
                this.requestProcessorSet.add(requestProcessor);
            } else {
                throw new Error("requestProcessor must implement IProcessRequest");
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {*} request
         * @param {*} responder
         * @param {function(Throwable=)} callback
         */
        doPreProcessRequest: function(request, responder, callback) {
            $iterableSeries(this.requestPreProcessorSet, function(flow, requestPreProcessor) {
                requestPreProcessor.preProcessRequest(request, responder, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(callback);
        },

        /**
         * @private
         * @param {*} request
         * @param {*} responder
         * @param {function(Throwable=)} callback
         */
        doProcessRequest: function(request, responder, callback) {
            $iterableSeries(this.requestProcessorSet, function(flow, requestProcessor) {
                requestProcessor.processRequest(request, responder, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RequestProcessor).with(
        module("requestProcessor")
    );


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugrequest.RequestProcessor', RequestProcessor);
});
