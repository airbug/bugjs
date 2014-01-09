//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('AutowiredAnnotationProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var Set                 = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AutowiredAnnotationProcessor = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {IocContext} iocContext
     */
    _constructor: function(iocContext) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {IocContext}
         */
        this.iocContext                         = iocContext;

        /**
         * @private
         * @type {}
         */
        this.processedAutowiredAnnotationSet    = new Set();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {AutowiredAnnotation} autowiredAnnotation
     */
    process: function(autowiredAnnotation) {
        this.processAutowiredAnnotation(autowiredAnnotation);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {AutowiredAnnotation} autowiredAnnotation
     */
    processAutowiredAnnotation: function(autowiredAnnotation) {
        var _this                   = this;
        if (!this.processedAutowiredAnnotationSet.contains(autowiredAnnotation)) {
            var autowiredClass          = autowiredAnnotation.getAnnotationReference();
            var propertyAnnotationArray = autowiredAnnotation.getAutowiredProperties();
            var currentConstructor      = autowiredClass.prototype._constructor;
            autowiredClass.prototype._constructor = function() {
                var instance = this;
                currentConstructor.apply(this, arguments);
                propertyAnnotationArray.forEach(function(propertyAnnotation) {
                    if (propertyAnnotation.getPropertyRef()) {
                        instance[propertyAnnotation.getPropertyName()] = _this.iocContext.getModuleByName(propertyAnnotation.getPropertyRef());
                    } else {
                        instance[propertyAnnotation.getPropertyName()] = propertyAnnotation.getPropertyValue();
                    }
                });
            };
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.AutowiredAnnotationProcessor', AutowiredAnnotationProcessor);
