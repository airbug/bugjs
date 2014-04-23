//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmarsh.MarshPropertyAnnotation')

//@Require('Class')
//@Require('bugmeta.Annotation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

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
    var MarshPropertyAnnotation = Class.extend(Annotation, {

        _name: "bugmarsh.MarshPropertyAnnotation",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} propertyName
         * @param {string} getterName
         * @param {string} setterName
         */
        _constructor: function(propertyName, getterName, setterName) {

            this._super(MarshPropertyAnnotation.TYPE);


            //-------------------------------------------------------------------------------
            // Instance Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.getterName                 = getterName;

            /**
             * @private
             * @type {string}
             */
            this.propertyName               = propertyName;

            /**
             * @private
             * @type {string}
             */
            this.setterName                 = setterName;
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


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} getterName
         * @return {MarshPropertyAnnotation}
         */
        getter: function(getterName) {
            this.getterName = getterName;
            return this;
        },

        /**
         * @param {string} setterName
         * @returns {MarshPropertyAnnotation}
         */
        setter: function(setterName) {
            this.setterName = setterName;
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
    MarshPropertyAnnotation.TYPE    = "MarshProperty";


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} propertyName
     * @return {MarshPropertyAnnotation}
     */
    MarshPropertyAnnotation.property = function(propertyName) {
        return new MarshPropertyAnnotation(propertyName);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmarsh.MarshPropertyAnnotation', MarshPropertyAnnotation);
});
