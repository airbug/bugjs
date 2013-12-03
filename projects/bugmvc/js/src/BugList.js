//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmvc')

//@Export('BugList')

//@Require('Class')
//@Require('ObservableList')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var ObservableList      = bugpack.require('ObservableList');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {ObservableList}
 */
var BugList = Class.extend(ObservableList, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {IList} dataList
     */
    _constructor: function(dataList) {

        this._super(dataList);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.initialized    = false;

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {IList}
     */
    getData: function() {
        return this.getObserved();
    },

    /**
     * @return {boolean}
     */
    isInitialized: function() {
        return this.initialized;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    clear: function() {
        this._super();
        this.reinitialize();
    },

    /**
     *
     */
    initialize: function() {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.initializeModel();
        }
    },

    /**
     *
     */
    reinitialize: function() {
        if (this.isInitialized()) {
            this.deinitialize();
        }
        this.initialize();
    },

    /**
     *
     */
    deinitialize: function() {
        if (this.isInitialized()) {
            this.initialized = false;
            this.deinitializeModel();
        }
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeModel: function() {

    },

    /**
     * @protected
     */
    initializeModel: function() {

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmvc.BugList', BugList);
