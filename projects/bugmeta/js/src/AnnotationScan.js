//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmeta')

//@Export('AnnotationScan')

//@Require('Class')
//@Require('Obj')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AnnotationScan = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {AnnotationProcessor} processor
     * @param {string} forType
     */
    _constructor: function(processor, forType) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.forType    = forType;

        /**
         * @private
         * @type {AnnotationProcessor}
         */
        this.processor  = processor;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {AnnotationProcessor}
     */
    getProcessor: function() {
        return this.processor;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    scanAll: function() {
        var _this       = this;
        var bugmeta     = BugMeta.context();
        var annotations = bugmeta.getAnnotationsByType(this.forType);
        if (annotations) {
            annotations.forEach(function(annotation) {
                _this.processor.process(annotation);
            });
        }
    },

    /**
     * @param {Class} _class
     */
    scanClass: function(_class) {
        var _this       = this;
        var bugmeta     = BugMeta.context();
        var annotations = bugmeta.getAnnotationsByReference(_class);
        if (annotations) {
            annotations.forEach(function(annotation) {
                if (annotation.getAnnotationType() === _this.forType) {
                    _this.processor.process(annotation);
                }
            });
        }
    },

    /**
     * @param {Array.<Class>} _classes
     */
    scanClasses: function(_classes) {
        var _this = this;
        _classes.forEach(function(_class) {
            _this.scanClass(_class);
        });
    },

    /**
     * @param {string} bugpackKey
     */
    scanBugpack: function(bugpackKey) {
        var _class = bugpack.require(bugpackKey);
        this.scanClass(_class);
    },

    /**
     * @param {Array.<string>} bugpackKeys
     */
    scanBugpacks: function(bugpackKeys) {
        var _this = this;
        bugpackKeys.forEach(function(bugpackKey) {
            _this.scanBugpack(bugpackKey);
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmeta.AnnotationScan', AnnotationScan);
