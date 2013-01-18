//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('annotate')

//@Export('Annotation')

//@Require('Class')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var List =  bugpack.require('List');
var Obj =   bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Annotation = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(type) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {List<*>}
         */
        this.paramList = new List();

        /**
         * @private
         * @type {*}
         */
        this.reference = null;

        /**
         * @private
         * @type {string}
         */
        this.type = type;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getReference: function() {
        return this.reference;
    },

    /**
     * @param {*} reference
     */
    setReference: function(reference) {
        this.reference = reference;
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.type;
    },

    /**
     * @return {List<*>}
     */
    getParamList: function() {
        return this.paramList;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {...*}
        */
    params: function() {
        for (var i = 0, size = arguments.length; i < size; i++) {
            var param = arguments[i];
            this.paramList.add(param);
        }
        return this;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('annotate.Annotation', Annotation);
