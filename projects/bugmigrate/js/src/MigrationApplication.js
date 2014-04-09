//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmigrate.MigrationApplication')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugentity.EntityManagerAnnotationProcessor')
//@Require('bugentity.EntityManagerScan')
//@Require('bugioc.AutowiredAnnotationProcessor')
//@Require('bugioc.AutowiredScan')
//@Require('bugioc.ConfigurationAnnotationProcessor')
//@Require('bugioc.ConfigurationScan')
//@Require('bugioc.IocContext')
//@Require('bugioc.ModuleAnnotationProcessor')
//@Require('bugioc.ModuleScan')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Obj                                 = bugpack.require('Obj');
var EntityManagerAnnotationProcessor    = bugpack.require('bugentity.EntityManagerAnnotationProcessor');
var EntityManagerScan                   = bugpack.require('bugentity.EntityManagerScan');
var AutowiredAnnotationProcessor        = bugpack.require('bugioc.AutowiredAnnotationProcessor');
var AutowiredScan                       = bugpack.require('bugioc.AutowiredScan');
var ConfigurationAnnotationProcessor    = bugpack.require('bugioc.ConfigurationAnnotationProcessor');
var ConfigurationScan                   = bugpack.require('bugioc.ConfigurationScan');
var IocContext                          = bugpack.require('bugioc.IocContext');
var ModuleAnnotationProcessor           = bugpack.require('bugioc.ModuleAnnotationProcessor');
var ModuleScan                          = bugpack.require('bugioc.ModuleScan');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MigrationApplication = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {IocContext}
         */
        this.iocContext         = new IocContext();

        /**
         * @private
         * @type {AutowiredScan}
         */
        this.autowiredScan      = new AutowiredScan(BugMeta.context(), new AutowiredAnnotationProcessor(this.iocContext));

        /**
         * @private
         * @type {ConfigurationScan}
         */
        this.configurationScan  = new ConfigurationScan(BugMeta.context(), new ConfigurationAnnotationProcessor(this.iocContext));

        /**
         * @private
         * @type {EntityManagerScan}
         */
        this.entityManagerScan  = new EntityManagerScan(BugMeta.context(), new EntityManagerAnnotationProcessor(this.iocContext));

        /**
         * @private
         * @type {ModuleScan}
         */
        this.moduleScan         = new ModuleScan(BugMeta.context(), new ModuleAnnotationProcessor(this.iocContext));
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    start: function(callback) {
        this.autowiredScan.scanAll();
        this.autowiredScan.scanContinuous();
        this.configurationScan.scanBugpacks([
            "bugmigrate.MigrationConfiguration"
        ]);
        this.entityManagerScan.scanAll();
        this.moduleScan.scanBugpacks([
            "bugentity.EntityDeltaBuilder",
            "bugentity.EntityManagerStore",
            "bugentity.SchemaManager",
            "bugmigrate.MigrationInitializer",
            "bugmigrate.MigrationManager",
            "configbug.Configbug",
            "loggerbug.Logger",
            "mongo.MongoDataStore"
        ]);
        this.iocContext.process();
        this.iocContext.initialize(callback);
    },

    /**
     * @param {function(Throwable=)} callback
     */
    stop: function(callback) {
        this.iocContext.deinitialize(callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmigrate.MigrationApplication', MigrationApplication);
