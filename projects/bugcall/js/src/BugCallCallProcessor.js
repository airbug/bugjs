//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('BugCallCallProcessor')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugcall.IPreProcessCall')
//@Require('bugcall.IProcessCall')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug                 = bugpack.require('ArgumentBug');
var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var Set                         = bugpack.require('Set');
var IPreProcessCall             = bugpack.require('bugcall.IPreProcessCall');
var IProcessCall                = bugpack.require('bugcall.IProcessCall');
var BugFlow                     = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $iterableSeries             = BugFlow.$iterableSeries;
var $series                     = BugFlow.$series;
var $task                       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var BugCallCallProcessor = Class.extend(Obj, {

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
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {CallManager} callManager
     * @param {function(Throwable=)} callback
     */
    processCall: function(callManager, callback) {
        var _this           = this;
        $series([
            $task(function(flow) {
                _this.doPreProcessCall(callManager, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.doProcessCall(callManager, function(throwable) {
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
     * @param {CallManager} callManager
     * @param {function(Throwable)} callback
     */
    doPreProcessCall: function(callManager, callback) {
        $iterableSeries(this.callPreProcessorSet, function(flow, callPreProcessor) {
            callPreProcessor.preProcessCall(callManager, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(callback);
    },

    /**
     * @private
     * @param {CallManager} callManager
     * @param {function(Throwable)} callback
     */
    doProcessCall: function(callManager, callback) {
        $iterableSeries(this.callProcessorSet, function(flow, callProcessor) {
            callProcessor.processCall(callManager, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(callback);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.BugCallCallProcessor', BugCallCallProcessor);
