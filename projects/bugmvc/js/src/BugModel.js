//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmvc')

//@Export('BugModel')

//@Require('Class')
//@Require('ISet')
//@Require('LiteralUtil')
//@Require('Obj')
//@Require('ObservableObject')
//@Require('ObservableSet')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var ISet                = bugpack.require('ISet');
var LiteralUtil         = bugpack.require('LiteralUtil');
var Obj                 = bugpack.require('Obj');
var ObservableObject    = bugpack.require('ObservableObject');
var ObservableSet       = bugpack.require('ObservableSet');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {ObservableObject}
 */
var BugModel = Class.extend(ObservableObject, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Object} dataObject
     */
    _constructor: function(dataObject) {

        this._super({});


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.initialized    = false;

        var _this = this;
        Obj.forIn(dataObject, function(propertyName, propertyValue) {
            _this.setProperty(propertyName, propertyValue);
        });
        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {Object}
     */
    getData: function() {
        return this.getObservedObject();
    },

    /**
     * @return {boolean}
     */
    isInitialized: function() {
        return this.initialized;
    },


    //-------------------------------------------------------------------------------
    // ObservableObject Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    setProperty: function(propertyName, propertyValue) {
        if (Class.doesImplement(propertyValue, ISet)) {
            this._super(propertyName, new ObservableSet(propertyValue));
        } else {
            this._super(propertyName, propertyValue);
        }
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    clear: function() {
        this.clearProperties();
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

    /**
     * @returns {*}
     */
    toLiteral: function() {
        return LiteralUtil.convertToLiteral(this.getData());
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

bugpack.export('bugmvc.BugModel', BugModel);
