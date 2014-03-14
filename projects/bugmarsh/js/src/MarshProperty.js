//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmarsh')

//@Export('MarshProperty')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MarshProperty = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(propertyName, getterName, setterName) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.getterName         = getterName;

        /**
         * @private
         * @type {string}
         */
        this.propertyName       = propertyName;

        /**
         * @private
         * @type {string}
         */
        this.setterName         = setterName;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getGetterName: function() {
        return this.getterName;
    },

    /**
     * @return {string}
     */
    getPropertyName: function() {
        return this.propertyName;
    },

    /**
     * @return {string}
     */
    getSetterName: function() {
        return this.setterName;
    },

    /**
     * @return {boolean}
     */
    hasGetter: function() {
        return !!this.getGetterName();
    },

    /**
     * @return {boolean}
     */
    hasSetter: function() {
        return !!this.getSetterName();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmarsh.MarshProperty', MarshProperty);