//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmeta')

//@Export('AnnotationScan')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
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
var Set                         = bugpack.require('Set');
var TypeUtil                    = bugpack.require('TypeUtil');
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
     * @param {{
     *      excludes: Array.<string>
     * }=} scanOptions
     */
    scanAll: function(scanOptions) {
        var _this           = this;
        var bugmeta         = BugMeta.context();
        var excludeSet      = new Set();
        var annotations     = bugmeta.getAnnotationsByType(this.forType);
        if (scanOptions && scanOptions.excludes) {
            scanOptions.excludes.forEach(function(exclude) {
                if (TypeUtil.isString(exclude)) {
                    excludeSet.add(bugpack.require(exclude));
                } else {
                    excludeSet.add(exclude);
                }
            });
        }
        if (annotations) {
            annotations.forEach(function(annotation) {
                if (!excludeSet.contains(annotation.getAnnotationReference())) {
                    _this.processor.process(annotation);
                }
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
