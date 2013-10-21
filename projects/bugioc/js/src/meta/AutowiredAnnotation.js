//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('AutowiredAnnotation')

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
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array.<PropertyAnnotation>} autowiredPropertyArray
     */
    properties: function(autowiredPropertyArray) {
        this.autowiredPropertyArray = autowiredPropertyArray;
        return this;
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @return {ConfigurationAnnotation}
 */
AutowiredAnnotation.autowired = function() {
    return new AutowiredAnnotation();
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.AutowiredAnnotation', AutowiredAnnotation);
