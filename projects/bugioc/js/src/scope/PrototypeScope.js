//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.PrototypeScope')

//@Require('Class')
//@Require('List')
//@Require('bugioc.Scope')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class = bugpack.require('Class');
    var List = bugpack.require('List');
    var Scope = bugpack.require('bugioc.Scope');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Scope}
     */
    var PrototypeScope = Class.extend(Scope, {

        _name: "bugioc.PrototypeScope",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IocContext} iocContext
         * @param {IocModule} iocModule
         */
        _constructor: function(iocContext, iocModule) {

            this._super(iocContext, iocModule);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {List<*>}
             */
            this.generatedModuleList = new List();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        generateModule: function() {
            var module = this.factoryModule();
            this.generatedModuleList.add(module);
            return module;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.PrototypeScope', PrototypeScope);
});
