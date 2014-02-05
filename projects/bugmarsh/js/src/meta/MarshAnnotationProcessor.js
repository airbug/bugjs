//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmarsh')

//@Export('MarshAnnotationProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('bugmarsh.Marsh')
//@Require('bugmarsh.MarshProperty')
//@Require('bugmeta.IAnnotationProcessor')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var Marsh                   = bugpack.require('bugmarsh.Marsh');
var MarshProperty           = bugpack.require('bugmarsh.MarshProperty');
var IAnnotationProcessor    = bugpack.require('bugmeta.IAnnotationProcessor');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 * @implements {IAnnotationProcessor}
 */
var MarshAnnotationProcessor = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MarshRegistry} marshRegistry
     * @private
     */
    _constructor: function(marshRegistry) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MarshRegistry}
         */
        this.marshRegistry = marshRegistry;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MarshRegistry}
     */
    getMarshRegistry: function() {
        return this.marshRegistry;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MarshAnnotation} marshAnnotation
     */
    process: function(marshAnnotation) {
        var _this               = this;
        var marshClass          = marshAnnotation.getAnnotationReference();
        var marshName           = marshAnnotation.getMarshName();
        if (!this.marshRegistry.hasMarshForClass(marshClass) && !this.marshRegistry.hasMarshForName(marshName)) {
            var marsh = this.factoryMarsh(marshClass, marshName);
            marshAnnotation.getMarshProperties().forEach(function(propertyAnnotation) {
                var marshProperty = _this.factoryMarshProperty(propertyAnnotation.getPropertyName(),
                    propertyAnnotation.getGetterName(), propertyAnnotation.getSetterName());
                marsh.addProperty(marshProperty);
            });
            this.marshRegistry.registerMarsh(marsh);
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Class} marshClass
     * @param {string} marshName
     * @return {Marsh}
     */
    factoryMarsh: function(marshClass, marshName) {
        return new Marsh(marshClass, marshName);
    },

    /**
     * @private
     * @param {string} propertyName
     * @param {string} getterName
     * @param {string} setterName
     * @return {MarshProperty}
     */
    factoryMarshProperty: function(propertyName, getterName, setterName) {
        return new MarshProperty(propertyName, getterName, setterName);
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(MarshAnnotationProcessor, IAnnotationProcessor);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmarsh.MarshAnnotationProcessor', MarshAnnotationProcessor);
