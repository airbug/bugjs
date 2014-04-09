//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmigrate.MigrationAnnotation')

//@Require('Class')
//@Require('bugmeta.Annotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


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
var MigrationAnnotation = Class.extend(Annotation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super(MigrationAnnotation.TYPE);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.migrationAppName       = null;

        /**
         * @private
         * @type {string}
         */
        this.migrationAppVersion    = null;

        /**
         * @private
         * @type {string}
         */
        this.migrationName          = null;

        /**
         * @private
         * @type {string}
         */
        this.migrationVersion       = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getMigrationAppName: function() {
        return this.migrationAppName;
    },

    /**
     * @return {string}
     */
    getMigrationAppVersion: function() {
        return this.migrationAppVersion;
    },

    /**
     * @return {string}
     */
    getMigrationName: function() {
        return this.migrationName;
    },

    /**
     * @return {string}
     */
    getMigrationVersion: function() {
        return this.migrationVersion;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} migrationAppName
     * @returns {MigrationAnnotation}
     */
    appName: function(migrationAppName) {
        this.migrationAppName = migrationAppName;
        return this;
    },

    /**
     * @param {string} migrationAppVersion
     * @returns {MigrationAnnotation}
     */
    appVersion: function(migrationAppVersion) {
        this.migrationAppVersion = migrationAppVersion;
        return this;
    },

    /**
     * @param {string} migrationName
     */
    name: function(migrationName) {
        this.migrationName = migrationName;
        return this;
    },

    /**
     * @param {string} migrationVersion
     * @returns {MigrationAnnotation}
     */
    version: function(migrationVersion) {
        this.migrationVersion = migrationVersion;
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
MigrationAnnotation.TYPE = "Migration";


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @return {MigrationAnnotation}
 */
MigrationAnnotation.migration = function() {
    return new MigrationAnnotation();
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmigrate.MigrationAnnotation', MigrationAnnotation);
