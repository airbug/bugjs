//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.Scope')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class = bugpack.require('Class');
    var Obj = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Scope = Class.extend(Obj, {

        _name: "bugioc.Scope",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IocContext} iocContext
         * @param {IocModule} iocModule
         */
        _constructor: function(iocContext, iocModule) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {IocContext}
             */
            this.iocContext     = iocContext;

            /**
             * @private
             * @type {IocModule}
             */
            this.iocModule      = iocModule;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {IocContext}
         */
        getIocContext: function() {
            return this.iocContext;
        },

        /**
         * @return {IocModule}
         */
        getIocModule: function() {
            return this.iocModule;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        factoryModule: function() {
            var moduleFactory = this.iocModule.getModuleFactory();
            return moduleFactory.factoryModule(this.iocModule);
        },

        /**
         * @abstract
         * @return {*}
         */
        generateModule: function() {

        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.Scope', Scope);
});
