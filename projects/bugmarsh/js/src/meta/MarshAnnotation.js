//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmarsh.MarshAnnotation')

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
    var MarshAnnotation = Class.extend(Annotation, {

        _name: "bugmarsh.MarshAnnotation",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} marshName
         */
        _constructor: function(marshName) {

            this._super(MarshAnnotation.TYPE);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.marshName          = marshName;

            /**
             * @private
             * @type {Array.<MarshPropertyAnnotation>}
             */
            this.marshProperties    = [];
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getMarshName: function() {
            return this.marshName;
        },

        /**
         * @return {Array.<MarshPropertyAnnotation>}
         */
        getMarshProperties: function() {
            return this.marshProperties;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<MarshPropertyAnnotation>} marshProperties
         * @return {MarshAnnotation}
         */
        properties: function(marshProperties) {
            this.marshProperties = marshProperties;
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
    MarshAnnotation.TYPE    = "Marsh";


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} marshName
     * @return {MarshAnnotation}
     */
    MarshAnnotation.marsh   = function(marshName) {
        return new MarshAnnotation(marshName);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmarsh.MarshAnnotation', MarshAnnotation);
});
