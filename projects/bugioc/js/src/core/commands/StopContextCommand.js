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

//@Export('bugioc.StopContextCommand')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('StateEvent')
//@Require('bugioc.ContextCommand')
//@Require('bugioc.IocContext')


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
    var IocContext      = bugpack.require('bugioc.IocContext');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ContextCommand}
     */
    var StopContextCommand = Class.extend(ContextCommand, {

        _name: "bugioc.StopContextCommand",


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
                if (iocContext.isRunning()) {
                    this.stopContext();
                } else if (iocContext.isReady()) {
                    this.complete();
                } else {
                    this.complete(new Exception("IllegalState", {}, "IocContext is not ready and cannot have stop called on it"));
                }
            } else {
                this.complete(new Exception("IllegalState", {}, "IocContext has not been generated. Must call generate() before calling stop()"));
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
            this.getIocContext().addEventListener(IocContext.EventTypes.THROWABLE, this.hearContextThrowable, this);
        },

        /**
         * @private
         * @param {Throwable=} throwable
         */
        complete: function(throwable) {
            if (!this.completed) {
                this.completed = true;
                this.removeContextListeners();
                this.iocContext = null;
                if (!throwable) {
                    this.callback();
                } else {
                    this.callback(throwable);
                }
            } else {
                throw new Bug("IllegalState", {}, "StopContextCommand already complete");
            }
        },

        /**
         * @private
         */
        removeContextListeners: function() {
            this.getIocContext().removeEventListener(StateEvent.EventTypes.STATE_CHANGED, this.hearContextStateChanged, this);
            this.getIocContext().removeEventListener(IocContext.EventTypes.THROWABLE, this.hearContextThrowable, this);
        },

        /**
         * @private
         */
        stopContext: function() {
            this.addContextListeners();
            this.getIocContext().stopContext();
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {StateEvent} event
         */
        hearContextStateChanged: function(event) {
            if (event.getCurrentState() === IocContext.ContextState.READY) {
                this.complete();
            } else {
                this.complete(new Exception("IllegalState", {}, "Unexpected state change for start command"));
            }
        },

        /**
         * @private
         * @param {Event} event
         */
        hearContextThrowable: function(event) {
            this.complete(event.getData().throwable);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.StopContextCommand', StopContextCommand);
});
