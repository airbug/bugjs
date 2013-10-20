//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('AutowiredScan')

//@Require('Class')
//@Require('Obj')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var BugMeta     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AutowiredScan = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {IocContext} iocContext
     */
    _constructor: function(iocContext) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {IocContext}
         */
        this.iocContext = iocContext;

        /**
         * @private
         * @type {boolean}
         */
        this.scanning = false;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    scan: function() {
        var _this = this;
        if (!this.scanning) {
            this.scanning = true;
            var bugmeta                 = BugMeta.context();
            var autowiredAnnotations    = bugmeta.getAnnotationsByType("Autowired");
            if (autowiredAnnotations) {
                autowiredAnnotations.forEach(function(annotation) {
                    _this.processAutowiredAnnotation(annotation);
                });
            }
            bugmeta.registerAnnotationProcessor("Autowired", function(annotation) {
                _this.processAutowiredAnnotation(annotation);
            });
        }
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Annotation} autowiredAnnotation
     */
    processAutowiredAnnotation: function(autowiredAnnotation) {
        var _scan = this;
        var autowiredClass = autowiredAnnotation.getAnnotationReference();
        var propertyAnnotationArray = autowiredAnnotation.getProperties();
        var currentConstructor = autowiredClass.prototype._constructor;
        autowiredClass.prototype._constructor = function() {
            var _this = this;
            currentConstructor.apply(this, arguments);
            propertyAnnotationArray.forEach(function(propertyAnnotation) {
                _this[propertyAnnotation.getName()] = _scan.iocContext.getModuleByName(propertyAnnotation.getRef());
            });
        };
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.AutowiredScan', AutowiredScan);
