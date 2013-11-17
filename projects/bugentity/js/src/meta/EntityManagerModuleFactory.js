//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityManagerModuleFactory')

//@Require('Class')
//@Require('bugioc.ModuleFactory')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var ModuleFactory       = bugpack.require('bugioc.ModuleFactory');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityManagerModuleFactory = Class.extend(ModuleFactory, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {IocContext} iocContext
     * @param {IocModule} iocModule
     * @param {Class} entityManagerClass
     * @param {string} entityType
     */
    _constructor: function(iocContext, iocModule, entityManagerClass, entityType) {

        this._super(iocContext, iocModule);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Class}
         */
        this.entityManagerClass     = entityManagerClass;

        /**
         * @private
         * @type {string}
         */
        this.entityType             = entityType;
    },


    //-------------------------------------------------------------------------------
    // ModuleFactory Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    factoryModule: function() {
        var moduleArgs      = this.buildModuleArgs();
        var entityManager   = this.entityManagerClass.create(moduleArgs);
        entityManager.setEntityType(this.entityType);
        return entityManager;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityManagerModuleFactory', EntityManagerModuleFactory);
