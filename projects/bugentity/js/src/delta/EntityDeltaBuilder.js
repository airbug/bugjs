//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugentity.EntityDeltaBuilder')
//@Autoload

//@Require('Class')
//@Require('bugdelta.DeltaBuilder')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityCalculator')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var DeltaBuilder                    = bugpack.require('bugdelta.DeltaBuilder');
var Entity                          = bugpack.require('bugentity.Entity');
var EntityCalculator                = bugpack.require('bugentity.EntityCalculator');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var module                      = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {DeltaBuilder}
 */
var EntityDeltaBuilder = Class.extend(DeltaBuilder, {

    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initialize: function() {
        this._super();
        this.getCalculatorResolver().registerCalculatorForClass(Entity, new EntityCalculator(this));
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(EntityDeltaBuilder).with(
    module("entityDeltaBuilder")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityDeltaBuilder', EntityDeltaBuilder);
