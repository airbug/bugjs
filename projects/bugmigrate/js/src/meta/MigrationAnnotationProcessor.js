//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmigrate')

//@Export('MigrationAnnotationProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Obj                             = bugpack.require('Obj');
var Set                             = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MigrationAnnotationProcessor = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MigrationManager} migrationManager
     */
    _constructor: function(migrationManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MigrationManager}
         */
        this.migrationManager           = migrationManager;

        /**
         * @private
         * @type {Set.<Annotation>}
         */
        this.processedAnnotationSet     = new Set();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MigrationManager}
     */
    getMigrationManager: function() {
        return this.migrationManager;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Annotation} annotation
     */
    process: function(annotation) {
        this.processMigrationAnnotation(/** @type {MigrationAnnotation} */(annotation));
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {MigrationAnnotation} migrationAnnotation
     */
    buildMigration: function(migrationAnnotation) {
        var _class = migrationAnnotation.getAnnotationReference();
        var migration = new _class(migrationAnnotation.getMigrationAppName(), migrationAnnotation.getMigrationAppVersion(), migrationAnnotation.getMigrationName(), migrationAnnotation.getMigrationVersion());
        this.migrationManager.registerMigration(migration);
    },

    /**
     * @protected
     * @param {MigrationAnnotation} migrationAnnotation
     */
    processMigrationAnnotation: function(migrationAnnotation) {
        if (!this.processedAnnotationSet.contains(migrationAnnotation)) {
            this.buildMigration(migrationAnnotation);
            this.processedAnnotationSet.add(migrationAnnotation);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmigrate.MigrationAnnotationProcessor', MigrationAnnotationProcessor);
