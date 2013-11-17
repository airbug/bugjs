//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugservice')

//@Export('ServiceAnnotation')

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

var ServiceAnnotation = Class.extend(Annotation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super("Service");


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {List.<MethodAnnotation>}
         */
        this.methodList = new List();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {List.<MethodAnnotation>}
     */
    getMethodList: function() {
        return this.methodList;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array.<MethodAnnotation>} methodArray
     */
    methods: function(methodArray) {
        this.methodList.addAll(methodArray);
        return this;
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @return {ServiceAnnotation}
 */
ServiceAnnotation.service = function() {
    return new ServiceAnnotation();
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugservice.ServiceAnnotation', ServiceAnnotation);
