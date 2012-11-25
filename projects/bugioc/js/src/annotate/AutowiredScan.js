//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('AutowiredScan')

//@Require('Annotate')
//@require('Carapace')
//@Require('Class')
//@Require('ControllerRoute')
//@Require('Obj')


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
         * @type {Map<Class, CarapaceController>}
         */
        this.controllerClassToControllerMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    scan: function() {
        var _this = this;
        var autowiredAnnotations = Annotate.getAnnotationsByType("Autowired");
        if (autowiredAnnotations) {
            autowiredAnnotations.forEach(function(annotation) {
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
                _this[propertyAnnotation.getName()] = BugIOC.generateModuleByName(propertyAnnotation.getRef());
            });
        };
    }
});
