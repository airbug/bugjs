//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmigrate.Migration')

//@Require('Bug')
//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Migration = Class.extend(Obj, {

        _name: "bugmigrate.Migration",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} appName
         * @param {string} appVersion
         * @param {string} name
         * @param {string} version
         */
        _constructor: function(appName, appVersion, name, version) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.appName        = appName;

            /**
             * @private
             * @type {string}
             */
            this.appVersion     = appVersion;

            /**
             * @private
             * @type {string}
             */
            this.name           = name;

            /**
             * @private
             * @type {string}
             */
            this.version        = version;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getAppName: function(){
            return this.appName;
        },

        /**
         * @return {string}
         */
        getAppVersion: function(){
            return this.appVersion;
        },

        /**
         * @return {string}
         */
        getName: function() {
            return this.name;
        },

        /**
         * @return {string}
         */
        getVersion: function() {
            return this.version;
        },


        //-------------------------------------------------------------------------------
        // Abstract Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @param {function(Throwable=)} callback
         */
        up: function(callback) {
            throw new Bug("AbstractMethodNotImplemented", {}, "Abstract method 'up' not implemented");
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmigrate.Migration', Migration);
});
