//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.ModelBuilder')

//@Require('Class')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var List                = bugpack.require('List');
    var Obj                 = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ModelBuilder = Class.extend(Obj, {

        _name: "carapace.ModelBuilder",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(new:CarapaceModel)} modelConstructor
         */
        _constructor: function(modelConstructor) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Array.<*>}
             */
            this.modelArgs              = null;

            /**
             * @private
             * @type {function(new:CarapaceModel)}
             */
            this.modelConstructor       = modelConstructor;

            /**
             * @private
             * @type {*}
             */
            this.modelData              = null;

            /**
             * @private
             * @type {string}
             */
            this.modelName              = null;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<*>} args
         * @return {ModelBuilder}
         */
        args: function(args) {
            this.modelArgs = args;
            return this;
        },

        /**
         * @param {CarapaceContainer} container
         * @return {CarapaceModel}
         */
        build: function(container) {
            var args    = this.modelArgs || [this.modelData];
            /** @type {CarapaceModel} */
            var model   = this.modelConstructor.getClass().newInstance(args);
            if (container) {
                if (this.modelName) {
                    container[this.modelName] = model;
                }
                container.addModel(model);
            }
            model.create();
            return model;
        },

        /**
         * @param {*} data
         * @return {ModelBuilder}
         */
        data: function(data) {
            this.modelData = data;
            return this;
        },

        /**
         * @param {string} modelName
         * @return {ModelBuilder}
         */
        name: function(modelName) {
            this.modelName = modelName;
            return this;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {function(new:CarapaceModel)} modelConstructor
     * @return {ModelBuilder}
     */
    ModelBuilder.model = function(modelConstructor) {
        return new ModelBuilder(modelConstructor);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('carapace.ModelBuilder', ModelBuilder);
});
