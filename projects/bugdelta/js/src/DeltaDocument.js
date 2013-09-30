//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('DeltaDocument')

//@Require('Class')
//@Require('Obj')
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
var Obj                 = bugpack.require('Obj');
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
        this.currentData    = data;

        /**
         * @private
         * @type {DeltaBuilder}
         */
        this.deltaBuilder   = new DeltaBuilder();

        /**
         * @private
         * @type {*}
         */
        this.previousData   = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getCurrentData: function() {
        return this.currentData;
    },

    /**
     * @return {*}
     */
    getPreviousData: function() {
        return this.previousData;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    commitDelta: function() {
        this.previousData = Obj.clone(this.currentData, true);
    },

    /**
     * @return {Delta}
     */
    generateDelta: function() {
        return this.deltaBuilder.buildDelta(this.previousData, this.currentData);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(DeltaDocument, IDelta);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugdelta.DeltaDocument', DeltaDocument);
