//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugservice')

//@Export('ServiceRoute')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugroutes.ICallRoute')
//@Require('bugservice.ServiceContext')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Exception       = bugpack.require('Exception');
var Obj             = bugpack.require('Obj');
var ICallRoute      = bugpack.require('bugroutes.ICallRoute');
var ServiceContext  = bugpack.require('bugservice.ServiceContext');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ServiceRoute = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(service, methodName, paramList) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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
    fire: function(request, responder) {
        var _this = this;
        var data            = request.getData();
        var serviceContext  = this.factoryServiceContext(request.getCallManager());
        var args = [serviceContext];
        this.paramList.forEach(function(param) {
            args.push(data[param]);
        });
        args.push(function() {
            var args = Array.prototype.slice.call(arguments, 0);
            var error = args[0];

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
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallRequest} request
     * @return {ServiceContext}
     */
    factoryServiceContext: function(request) {
        return new ServiceContext(request.getCallManager());
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
