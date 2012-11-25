//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ConfigurationAnnotation')

//@Require('Annotation')
//@Require('Class')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConfigurationAnnotation = Class.extend(Annotation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super("Configuration");


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array<ModuleAnnotation>}
         */
        this.moduleArray = [];
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Array<ModuleAnnotation>}
     */
    getModules: function() {
        return this.moduleArray;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<ModuleAnnotation>} moduleArray
     */
    modules: function(moduleArray) {
        this.moduleArray = moduleArray;
        return this;
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @return {ConfigurationAnnotation}
 */
ConfigurationAnnotation.configuration = function() {
    return new ConfigurationAnnotation();
};
