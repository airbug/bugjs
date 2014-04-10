//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.AutowiredAnnotation')

//@Require('Class')
//@Require('bugmeta.Annotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Annotation      = bugpack.require('bugmeta.Annotation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Annotation}
 */
var AutowiredAnnotation = Class.extend(Annotation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super(AutowiredAnnotation.TYPE);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array.<PropertyAnnotation>}
         */
        this.autowiredPropertyArray = [];
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Array.<PropertyAnnotation>}
     */
    getAutowiredProperties: function() {
        return this.autowiredPropertyArray;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array.<PropertyAnnotation>} autowiredPropertyArray
     * @return {AutowiredAnnotation}
     */
    properties: function(autowiredPropertyArray) {
        this.autowiredPropertyArray = autowiredPropertyArray;
        return this;
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
AutowiredAnnotation.TYPE = "Autowired";


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @return {AutowiredAnnotation}
 */
AutowiredAnnotation.autowired = function() {
    return new AutowiredAnnotation();
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.AutowiredAnnotation', AutowiredAnnotation);
