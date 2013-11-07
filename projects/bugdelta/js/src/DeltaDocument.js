//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('DeltaDocument')

//@Require('Class')
//@Require('IClone')
//@Require('Obj')
//@Require('TypeUtil')


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
                    target      = currentData[pathPart];
                    currentData = currentData[pathPart];
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
    // IClone Overrides
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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugdelta.DeltaDocument', DeltaDocument);
