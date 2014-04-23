//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugentity.SchemaManager')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugentity.EntityProcessor')
//@Require('bugentity.EntityScan')
//@Require('bugioc.IProcessModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug                 = bugpack.require('Bug');
    var Class               = bugpack.require('Class');
    var Map                 = bugpack.require('Map');
    var Obj                 = bugpack.require('Obj');
    var EntityProcessor     = bugpack.require('bugentity.EntityProcessor');
    var EntityScan          = bugpack.require('bugentity.EntityScan');
    var IProcessModule      = bugpack.require('bugioc.IProcessModule');
    var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta              = BugMeta.context();
    var module               = ModuleAnnotation.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IProcessModule}
     */
    var SchemaManager = Class.extend(Obj, {

        _name: "bugentity.SchemaManager",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<Class, Schema>}
             */
            this.classToSchemaMap   = new Map();

            /**
             * @private
             * @type {Map.<string, Schema>}
             */
            this.nameToSchemaMap    = new Map();

            /**
             * @private
             * @type {boolean}
             */
            this.processed          = false;
        },


        //-------------------------------------------------------------------------------
        // IProcessModule Implementation
        //-------------------------------------------------------------------------------

        /**
         *
         */
        processModule: function() {
            if (!this.processed) {
                this.processed = true;
                var entityScan = new EntityScan(bugmeta, new EntityProcessor(this));
                entityScan.scanAll();
            } else {
                throw new Bug("IllegalState", {}, "Already processed module SchemaManager");
            }
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {ICollection.<EntitySchema>}
         */
        getSchemaCollection: function() {
            this.assertProcessed();
            return this.nameToSchemaMap.getValueCollection();
        },

        /**
         * @param {Class} _class
         * @return {EntitySchema}
         */
        getSchemaByClass: function(_class) {
            this.assertProcessed();
            return this.classToSchemaMap.get(_class);
        },

        /**
         * @param {string} name
         * @return {EntitySchema}
         */
        getSchemaByName: function(name) {
            this.assertProcessed();
            return this.nameToSchemaMap.get(name);
        },

        /**
         * @param {Class} _class
         * @return {boolean}
         */
        hasSchemaForClass: function(_class) {
            this.assertProcessed();
            return this.classToSchemaMap.containsKey(_class);
        },

        /**
         * @param {string} name
         * @return {boolean}
         */
        hasSchemaForName: function(name) {
            this.assertProcessed();
            return this.nameToSchemaMap.containsKey(name);
        },

        /**
         * @param {EntitySchema} schema
         */
        registerSchema: function(schema) {
            if (this.hasSchemaForClass(schema.getEntityClass())) {
                throw new Error("Schema already registered for class - class:", schema.getEntityClass());
            }
            if (this.hasSchemaForName(schema.getEntityName())) {
                throw new Error("Schema already registered for entity name - name:", schema.getEntityName());
            }
            this.classToSchemaMap.put(schema.getEntityClass(), schema);
            this.nameToSchemaMap.put(schema.getEntityName(), schema);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        assertProcessed: function() {
            if (!this.processed) {
                throw new Bug("AssertFailed", {}, "Module 'SchemaManager' has not been processed");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(SchemaManager, IProcessModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(SchemaManager).with(
        module("schemaManager")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.SchemaManager', SchemaManager);
});
