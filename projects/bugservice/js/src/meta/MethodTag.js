//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugservice.MethodTag')

//@Require('Class')
//@Require('List')
//@Require('bugmeta.Tag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var List        = bugpack.require('List');
    var Tag  = bugpack.require('bugmeta.Tag');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Tag}
     */
    var MethodTag = Class.extend(Tag, {

        _name: "bugservice.MethodTag",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} methodName
         */
        _constructor: function(methodName) {

            this._super("Method");


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.methodName = methodName;

            /**
             * @private
             * @type {List.<ParamTag>}
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
         * @return {List.<ParamTag>}
         */
        getParamList: function() {
            return this.paramList;
        },


        //-------------------------------------------------------------------------------
        // Class Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<ParamTag>} paramArray
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
     * @static
     * @param {string} methodName
     * @return {MethodTag}
     */
    MethodTag.method = function(methodName) {
        return new MethodTag(methodName);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugservice.MethodTag', MethodTag);
});
