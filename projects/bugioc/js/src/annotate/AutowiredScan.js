//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('AutowiredScan')

//@Require('Class')
//@Require('Obj')
//@Require('annotate.Annotate')
//@Require('bugioc.BugIoc')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Obj =       bugpack.require('Obj');
var Annotate =  bugpack.require('annotate.Annotate');
var BugIoc =    bugpack.require('bugioc.BugIoc');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AutowiredScan = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

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
            var autowiredAnnotations = Annotate.getAnnotationsByType("Autowired");
            if (autowiredAnnotations) {
                autowiredAnnotations.forEach(function(annotation) {
                    _this.processAutowiredAnnotation(annotation);
                });
            }
            Annotate.registerAnnotationProcessor("Autowired", function(annotation) {
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
        var autowiredClass = autowiredAnnotation.getReference();
        var propertyAnnotationArray = autowiredAnnotation.getProperties();
        var currentConstructor = autowiredClass.prototype._constructor;
        autowiredClass.prototype._constructor = function() {
            var _this = this;
            currentConstructor.apply(this, arguments);
            propertyAnnotationArray.forEach(function(propertyAnnotation) {
                _this[propertyAnnotation.getName()] = BugIoc.generateModuleByName(propertyAnnotation.getRef());
            });
        };
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.AutowiredScan', AutowiredScan);
