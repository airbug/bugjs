//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugservice')

//@Export('ServiceProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('bugservice.ServiceRoute')
//@Require('bugservice.ServiceScan')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var ServiceRoute    = bugpack.require('bugservice.ServiceRoute');
var ServiceScan     = bugpack.require('bugservice.ServiceScan');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ServiceProcessor = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(controller) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ServiceController}
         */
        this.controller  = controller;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    scan: function() {
        var serviceScan = new ServiceScan();
        var serviceAnnotationList = serviceScan.scan();
        if (serviceAnnotationList) {
            this.process(serviceAnnotationList);
        }
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {*} service
     * @param {string} methodName
     * @param {List.<string>} paramList
     */
    factoryServiceRoute: function(service, methodName, paramList) {
        new ServiceRoute(service, methodName, paramList);
    },

    /**
     * @private
     * @param {List.<ServiceAnnotation>} serviceAnnotationList
     */
    process: function(serviceAnnotationList) {
        var _this = this;
        serviceAnnotationList.forEach(function(serviceAnnotation) {
            var serviceClass = serviceAnnotation.getAnnotationReference();
            //TODO BRN: How do we generate the service here? Seems like we need to reach in to the application context.
            var service =



            var methodAnnotationList = serviceAnnotation.getMethodList();
            methodAnnotationList.forEach(function(methodAnnotation) {
                var serviceRoute = _this.factoryServiceRoute();
            });
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugservice.ServiceProcessor', ServiceProcessor);
