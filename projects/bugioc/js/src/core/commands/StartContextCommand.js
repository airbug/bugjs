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

//@Export('bugioc.StartContextCommand')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('StateEvent')
//@Require('bugioc.ContextCommand')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var StateEvent      = bugpack.require('StateEvent');
    var ContextCommand  = bugpack.require('bugioc.ContextCommand');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ContextCommand}
     */
    var StartContextCommand = Class.extend(ContextCommand, {

        _name: "bugioc.StartContextCommand",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IocContext} iocContext
         */
        _constructor: function(iocContext) {

            this._super(iocContext);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(Throwable=)}
             */
            this.callback       = null;

            /**
             * @private
             * @type {boolean}
             */
            this.completed      = false;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isCompleted: function() {
            return this.completed;
        },


        //-------------------------------------------------------------------------------
        // Command Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {function(Throwable=)} callback
         */
        executeCommand: function(callback) {
            this.callback = callback;
            var iocContext = this.getIocContext();
            if (iocContext.isGenerated()) {
                if (iocContext.isReady()) {
                    this.startContext();
                } else if (iocContext.isRunning()) {
                    this.complete();
                } else {
                    this.complete(new Exception("IllegalState", {}, "IocContext is not ready and cannot have start called on it"));
                }
            } else {
                this.complete(new Exception("IllegalState", {}, "IocContext has not been generated. Must call generate() before calling start()"));
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        addContextListeners: function() {
            this.getIocContext().addEventListener(StateEvent.EventTypes.STATE_CHANGED, this.hearContextStateChanged, this);
        },

        /**
         * @private
         * @param {Throwable=} throwable
         */
        complete: function(throwable) {
            if (!this.completed) {
                this.completed = true;
                this.removeProcessListeners(this.getWorkerContext().getWorkerProcess());
                this.workerContext = null;
                if (!throwable) {
                    this.callback();
                } else {
                    this.callback(throwable);
                }
            } else {
                throw new Bug("IllegalState", {}, "StartContextCommand already complete");
            }
        },

        /**
         * @private
         * @param {*} message
         */
        processMessage: function(message) {

            console.log("StartWorkerCommand#processMessage - message:", message);

            if (message.messageType === WorkerDefines.MessageTypes.WORKER_STARTED) {
                this.getWorkerContext().updateWorkerState(WorkerDefines.State.RUNNING);
                this.complete();
            }
        },

        /**
         * @private
         * @param {WorkerProcess} workerProcess
         */
        removeProcessListeners: function(workerProcess) {
            workerProcess.removeEventListener(WorkerProcess.EventTypes.CLOSED, this.hearProcessClosed, this);
            workerProcess.removeEventListener(WorkerProcess.EventTypes.MESSAGE, this.hearProcessMessage, this);
            workerProcess.removeEventListener(WorkerProcess.EventTypes.THROWABLE, this.hearProcessThrowable, this);
        },

        /**
         * @private
         */
        startContext: function() {
            this.addContextListeners();
            this.getIocContext().startContext();
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {StateEvent} event
         */
        hearContextStateChanged: function(event) {
            this.complete(new Exception("Worker closed before ready event"));
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.StartContextCommand', StartContextCommand);
});
