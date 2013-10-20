//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityManagerAnnotationProcessor')

//@Require('Class')
//@Require('Set')
//@Require('bugentity.EntityManagerModuleFactory');
//@Require('bugioc.ModuleAnnotationProcessor')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Set                             = bugpack.require('Set');
var EntityManagerModuleFactory      = bugpack.require('bugentity.EntityManagerModuleFactory');
var ModuleAnnotationProcessor       = bugpack.require('bugioc.ModuleAnnotationProcessor');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityManagerAnnotationProcessor = Class.extend(EntityManagerModuleFactory, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {IocContext} iocContext
     */
    _constructor: function(iocContext) {

        this._super(iocContext);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Set.<EntityManagerAnnotation>}
         */
        this.processedEntityManagerAnnotationSet   = new Set();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {EntityManagerAnnotation} entityManagerAnnotation
     */
    process: function(entityManagerAnnotation) {
        this.processEntityManagerAnnotation(entityManagerAnnotation);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {EntityManagerAnnotation} entityManagerAnnotation
     */
    processEntityManagerAnnotation: function(entityManagerAnnotation) {
        if (!this.processedEntityManagerAnnotationSet.contains(entityManagerAnnotation)) {
            var entityManagerClass      = entityManagerAnnotation.getAnnotationReference();
            var iocModule               = this.createIocModule(entityManagerAnnotation);
            var factory                 = new EntityManagerModuleFactory(this.iocContext, iocModule, entityManagerClass,
                                            entityManagerAnnotation.getEntityType());
            iocModule.setModuleFactory(factory);
            this.iocContext.registerIocModule(iocModule);
            this.processedEntityManagerAnnotationSet.add(entityManagerAnnotation);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityManagerAnnotationProcessor', EntityManagerAnnotationProcessor);