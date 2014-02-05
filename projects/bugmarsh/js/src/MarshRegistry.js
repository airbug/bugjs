//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmarsh')

//@Export('MarshRegistry')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugioc.IInitializeModule')
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
var IInitializeModule               = bugpack.require('bugioc.IInitializeModule');
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
    },


    //-------------------------------------------------------------------------------
    // IInitializeModule Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeModule: function(callback) {
        this.classToMarshMap.clear();
        this.nameToMarshMap.clear();
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeModule: function(callback) {
        var scan = new MarshAnnotationScan(new MarshAnnotationProcessor(this));
        scan.scanAll();
        callback();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Class} _class
     * @return {Marsh}
     */
    getMarshByClass: function(_class) {
        return this.classToMarshMap.get(_class);
    },

    /**
     * @param {string} name
     * @return {Marsh}
     */
    getMarshByName: function(name) {
        return this.nameToMarshMap.get(name);
    },

    /**
     * @param {Class} _class
     * @return {boolean}
     */
    hasMarshForClass: function(_class) {
        return this.classToMarshMap.containsKey(_class);
    },

    /**
     * @param {string} name
     * @return {boolean}
     */
    hasMarshForName: function(name) {
        return this.nameToMarshMap.containsKey(name);
    },

    /**
     * @param {Marsh} marsh
     */
    registerMarsh: function(marsh) {
        if (this.hasMarshForClass(marsh.getMarshClass())) {
            throw new Error("Marsh already registered for class - class:", marsh.getMarshClass());
        }
        if (this.hasMarshForName(marsh.getMarshName())) {
            throw new Error("Marsh already registered for entity name - name:", marsh.getMarshName());
        }
        this.classToMarshMap.put(marsh.getMarshClass(), marsh);
        this.nameToMarshMap.put(marsh.getMarshName(), marsh);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MarshRegistry, IInitializeModule);


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
