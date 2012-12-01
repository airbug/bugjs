//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('AutowiredAnnotation')

//@Require('Annotation')
//@Require('Class')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('AutowiredAnnotation');

var Annotation = bugpack.require('Annotation');
var Class = bugpack.require('Class');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AutowiredAnnotation = Class.extend(Annotation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super("Autowired");


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array<PropertyAnnotation>}
         */
        this.propertyArray = [];
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Array<PropertyAnnotation>}
     */
    getProperties: function() {
        return this.propertyArray;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<PropertyAnnotation>} propertyArray
     */
    properties: function(propertyArray) {
        this.propertyArray = propertyArray;
        return this;
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @return {ConfigurationAnnotation}
 */
AutowiredAnnotation.autowired = function() {
    return new AutowiredAnnotation();
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(AutowiredAnnotation);
