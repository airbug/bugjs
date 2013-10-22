//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('BugCallRequestProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugcall.IPreProcessRequest')
//@Require('bugcall.IProcessRequest')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var Set                         = bugpack.require('Set');
var IPreProcessRequest          = bugpack.require('bugcall.IPreProcessRequest');
var IProcessRequest             = bugpack.require('bugcall.IProcessRequest');
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
 * @constructor
 * @extends {Obj}
 */
var BugCallRequestProcessor = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

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
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {IncomingRequest} request
     * @param {CallResponder} responder
     * @param {function(Throwable)} callback
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
     * @param {IncomingRequest} request
     * @param {CallResponder} responder
     * @param {function(Throwable)} callback
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
     * @param {IncomingRequest} request
     * @param {CallResponder} responder
     * @param {function(Throwable)} callback
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
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.BugCallRequestProcessor', BugCallRequestProcessor);
