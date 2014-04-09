//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugservice.ServiceScan')

//@Require('Class')
//@Require('List')
//@Require('Obj')
//@Require('bugmeta.BugMeta')
//@Require('bugservice.ServiceAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var List                = bugpack.require('List');
var Obj                 = bugpack.require('Obj');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var ServiceAnnotation   = bugpack.require('bugservice.ServiceAnnotation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ServiceScan = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    //TODO BRN: In order to support this function, we need to be able to retrieve sub packages from a package so that
    // we can scan them recursively
    /**
     * @param {string} packageName
     * @return {List.<ServiceAnnotation>}
     */
    scanPackage: function(packageName) {
        /*var serviceAnnotationList = new List();
        var bugPackPackage = bugpack.getPackage(packageName);
        */
    },

    scan: function() {
        var bugmeta                 = BugMeta.context();
        var serviceAnnotationList   = bugmeta.getAnnotationsByType("Service");
        return serviceAnnotationList;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugservice.ServiceScan', ServiceScan);
