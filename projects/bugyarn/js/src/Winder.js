//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugyarn')

//@Export('Winder')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Winder = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} winderName
     * @param {function(Yarn)} winderFunction
     */
    _constructor: function(winderName, winderFunction) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(Yarn)}
         */
        this.winderFunction     = winderFunction;

        /**
         * @private
         * @type {string}
         */
        this.winderName         = winderName;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {function(Yarn)}
     */
    getWinderFunction: function() {
        return this.winderFunction;
    },

    /**
     * @return {string}
     */
    getWinderName: function() {
        return this.winderName;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Yarn} yarn
     */
    runWinder: function(yarn) {
        this.winderFunction.call(yarn.getYarnContext(), yarn);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugyarn.Winder', Winder);