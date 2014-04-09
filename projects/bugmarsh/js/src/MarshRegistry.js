//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmarsh.MarshRegistry')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugioc.IProcessModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmarsh.MarshAnnotationProcessor')
//@Require('bugmarsh.MarshAnnotationScan')
//@Require('bugmeta.BugMeta')



//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Bug                             = bugpack.require('Bug');
var Class                           = bugpack.require('Class');
var Map                             = bugpack.require('Map');
var Obj                             = bugpack.require('Obj');
var IProcessModule                  = bugpack.require('bugioc.IProcessModule');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var MarshAnnotationProcessor        = bugpack.require('bugmarsh.MarshAnnotationProcessor');
var MarshAnnotationScan             = bugpack.require('bugmarsh.MarshAnnotationScan');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var module                          = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MarshRegistry = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<Class, Marsh>}
         */
        this.classToMarshMap    = new Map();

        /**
         * @private
         * @type {Map.<string, Marsh>}
         */
        this.nameToMarshMap     = new Map();

        /**
         * @private
         * @type {boolean}
         */
        this.processed          = false;
    },


    //-------------------------------------------------------------------------------
    // IProcessModule Implementation
    //-------------------------------------------------------------------------------

    /**
     *
     */
    processModule: function() {
        if (!this.processed) {
            this.processed = true;
            var scan = new MarshAnnotationScan(bugmeta, new MarshAnnotationProcessor(this));
            scan.scanAll();
        } else {
            throw new Bug("IllegalState", {}, "Already processed module MarshRegistry");
        }
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Class} _class
     * @return {Marsh}
     */
    getMarshByClass: function(_class) {
        this.assertProcessed();
        return this.classToMarshMap.get(_class);
    },

    /**
     * @param {string} name
     * @return {Marsh}
     */
    getMarshByName: function(name) {
        this.assertProcessed();
        return this.nameToMarshMap.get(name);
    },

    /**
     * @param {Class} _class
     * @return {boolean}
     */
    hasMarshForClass: function(_class) {
        this.assertProcessed();
        return this.classToMarshMap.containsKey(_class);
    },

    /**
     * @param {string} name
     * @return {boolean}
     */
    hasMarshForName: function(name) {
        this.assertProcessed();
        return this.nameToMarshMap.containsKey(name);
    },

    /**
     * @param {Marsh} marsh
     */
    registerMarsh: function(marsh) {
        this.assertProcessed();
        if (this.hasMarshForClass(marsh.getMarshClass())) {
            throw new Error("Marsh already registered for class - class:", marsh.getMarshClass());
        }
        if (this.hasMarshForName(marsh.getMarshName())) {
            throw new Error("Marsh already registered for entity name - name:", marsh.getMarshName());
        }
        this.classToMarshMap.put(marsh.getMarshClass(), marsh);
        this.nameToMarshMap.put(marsh.getMarshName(), marsh);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    assertProcessed: function() {
        if (!this.processed) {
            throw new Bug("AssertFailed", {}, "Module 'MarshRegistry' has not been processed");
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MarshRegistry, IProcessModule);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MarshRegistry).with(
    module("marshRegistry")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmarsh.MarshRegistry', MarshRegistry);
