//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugservice')

//@Export('MethodAnnotation')

//@Require('Class')
//@Require('List')
//@Require('bugmeta.Annotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var List        = bugpack.require('List');
var Annotation  = bugpack.require('bugmeta.Annotation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MethodAnnotation = Class.extend(Annotation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(methodName) {

        this._super("Method");


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
         * @type {List.<ParamAnnotation>}
         */
        this.paramList = new List();
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
     * @return {List.<ParamAnnotation>}
     */
    getParamList: function() {
        return this.paramList;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array.<ParamAnnotation>} paramArray
     */
    params: function(paramArray) {
        this.paramList.addAll(paramArray);
        return this;
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {string} methodName
 * @return {MethodAnnotation}
 */
MethodAnnotation.method = function(methodName) {
    return new MethodAnnotation(methodName);
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugeservice.MethodAnnotation', MethodAnnotation);
