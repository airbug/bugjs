//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('DeltaDocument')

//@Require('Class')
//@Require('IClone')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaBuilder')
//@Require('bugdelta.IDelta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IClone              = bugpack.require('IClone');
var Obj                 = bugpack.require('Obj');
var TypeUtil            = bugpack.require('TypeUtil');
var DeltaBuilder        = bugpack.require('bugdelta.DeltaBuilder');
var IDelta              = bugpack.require('bugdelta.IDelta');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DeltaDocument = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(data) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.data               = data;

        /**
         * @private
         * @type {DeltaBuilder}
         */
        this.deltaBuilder       = new DeltaBuilder();

        /**
         * @private
         * @type {DeltaDocument}
         */
        this.previousDocument   = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getData: function() {
        return this.data;
    },

    /**
     * @param {*} data
     */
    setData: function(data) {
        this.data = data;
    },

    /**
     * @param {string} path
     */
    getPath: function(path) {
        var _this = this;
        var pathParts = path.split(".");
        var target = undefined;
        var currentData = this.data;
        pathParts.forEach(function(pathPart) {
            if (pathPart === "") {
                target = currentData;
            } else {
                if (TypeUtil.isObject(currentData)) {
                    if (TypeUtil.toType(currentData) === "Object") {
                        target = currentData[pathPart];
                    } else {
                        throw new Error("Unsupported type in path retrieval");
                    }
                } else {
                    throw new Error("Unsupported type in path retrieval");
                }
            }

            //TODO BRN: implement support for "[somevalue]"
        });
        return target;
    },

    /**
     * @return {DeltaDocument}
     */
    getPreviousDocument: function() {
        return this.previousDocument;
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {*}
     */
    clone: function(deep) {
        return new DeltaDocument(Obj.clone(this.getData(), deep));
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    commitDelta: function() {
        this.previousDocument = this.clone(true);
    },

    /**
     * @return {Delta}
     */
    generateDelta: function() {
        return this.deltaBuilder.buildDelta(this, this.getPreviousDocument());
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(DeltaDocument, IClone);
Class.implement(DeltaDocument, IDelta);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugdelta.DeltaDocument', DeltaDocument);
