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

//@Export('bugcall.CallProcessor')
//@Autoload

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Flows')
//@Require('Obj')
//@Require('Set')
//@Require('bugcall.IPreProcessCall')
//@Require('bugcall.IProcessCall')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgumentBug         = bugpack.require('ArgumentBug');
    var Class               = bugpack.require('Class');
    var Flows               = bugpack.require('Flows');
    var Obj                 = bugpack.require('Obj');
    var Set                 = bugpack.require('Set');
    var IPreProcessCall     = bugpack.require('bugcall.IPreProcessCall');
    var IProcessCall        = bugpack.require('bugcall.IProcessCall');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


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
    var CallProcessor = Class.extend(Obj, {

        _name: "bugcall.CallProcessor",


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
             * @type {Set.<IPreProcessCall>}
             */
            this.callPreProcessorSet         = new Set();

            /**
             * @private
             * @type {Set.<IProcessCall>}
             */
            this.callProcessorSet            = new Set();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Set.<IPreProcessCall>}
         */
        getCallPreProcessorSet: function() {
            return this.callPreProcessorSet;
        },

        /**
         * @return {Set.<IProcessCall>}
         */
        getCallProcessorSet: function() {
            return this.callProcessorSet;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {IPreProcessCall} callPreProcessor
         */
        deregisterCallPreProcessor: function(callPreProcessor) {
            this.callPreProcessorSet.remove(callPreProcessor);
        },

        /**
         * @param {IProcessCall} callProcessor
         */
        deregisterCallProcessor: function(callProcessor) {
            this.callProcessorSet.remove(callProcessor);
        },

        /**
         * @param {Call} call
         * @param {function(Throwable=)} callback
         */
        processCall: function(call, callback) {
            var _this           = this;
            $series([
                $task(function(flow) {
                    _this.doPreProcessCall(call, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.doProcessCall(call, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(callback);
        },

        /**
         * @param {IPreProcessCall} callPreProcessor
         * @throws {ArgumentBug}
         */
        registerCallPreProcessor: function(callPreProcessor) {
            if (Class.doesImplement(callPreProcessor, IPreProcessCall)) {
                this.callPreProcessorSet.add(callPreProcessor);
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "callPreProcessor", callPreProcessor, "parameter must implement IPreProcessCall");
            }
        },

        /**
         * @param {IProcessCall} callProcessor
         * @throws {ArgumentBug}
         */
        registerCallProcessor: function(callProcessor) {
            if (Class.doesImplement(callProcessor, IProcessCall)) {
                this.callProcessorSet.add(callProcessor);
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "callProcessor", callProcessor, "parameter must implement IProcessCall");
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Call} call
         * @param {function(Throwable)} callback
         */
        doPreProcessCall: function(call, callback) {
            $iterableSeries(this.callPreProcessorSet, function(flow, callPreProcessor) {
                callPreProcessor.preProcessCall(call, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(callback);
        },

        /**
         * @private
         * @param {Call} call
         * @param {function(Throwable)} callback
         */
        doProcessCall: function(call, callback) {
            $iterableSeries(this.callProcessorSet, function(flow, callProcessor) {
                callProcessor.processCall(call, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CallProcessor).with(
        module("callProcessor")
    );


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallProcessor', CallProcessor);
});
