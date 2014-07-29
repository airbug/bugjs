/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmvc.BugModel')

//@Require('Class')
//@Require('Exception')
//@Require('ISet')
//@Require('LiteralUtil')
//@Require('ObjectUtil')
//@Require('ObservableObject')
//@Require('ObservableSet')
//@Require('bugdispose.IDisposable')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var ISet                = bugpack.require('ISet');
    var LiteralUtil         = bugpack.require('LiteralUtil');
    var ObjectUtil          = bugpack.require('ObjectUtil');
    var ObservableObject    = bugpack.require('ObservableObject');
    var ObservableSet       = bugpack.require('ObservableSet');
    var IDisposable         = bugpack.require('bugdispose.IDisposable');
    var AutowiredTag        = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag         = bugpack.require('bugioc.PropertyTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired           = AutowiredTag.autowired;
    var bugmeta             = BugMeta.context();
    var property            = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ObservableObject}
     * @implements {IDisposable}
     */
    var BugModel = Class.extend(ObservableObject, {

        _name: "bugmvc.BugModel",


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
            this.created            = false;

            /**
             * @private
             * @type {GarbageDisposal}
             */
            this.garbageDisposal    = null;

            /**
             * @private
             * @type {boolean}
             */
            this.initialized        = false;
        },


        //-------------------------------------------------------------------------------
        // Initializer
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Object} dataObject
         */
        _initializer: function(dataObject) {
            this._super();
            var _this = this;
            ObjectUtil.forIn(dataObject, function(propertyName, propertyValue) {
                _this.setProperty(propertyName, propertyValue);
            });
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
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isCreated: function() {
            return this.created;
        },


        //-------------------------------------------------------------------------------
        // IDisposable Implementation
        //-------------------------------------------------------------------------------

        /**
         *
         */
        dispose: function() {
            this.destroy();
        },


        //-------------------------------------------------------------------------------
        // ObservableObject Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} propertyName
         * @param {*} propertyValue
         */
        setProperty: function(propertyName, propertyValue) {

            //TODO BRN: Add support for sub properties and other data types

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
            if (this.isCreated()) {
                this.reinitialize();
            }
        },

        /**
         *
         */
        create: function() {
            if (!this.created) {
                this.created = true;
                this.createModel();
                this.initialize();
            }
        },

        /**
         *
         */
        destroy: function() {
            if (this.created) {
                this.created = false;
                this.deinitialize();
                this.destroyModel();
            }
        },

        /**
         *
         */
        initialize: function() {
            if (!this.isCreated()) {
                throw new Exception("ModelNotCreated", {}, "Model is being initialized before it has been created. Must call .create() first");
            }
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
        createModel: function() {
            this.garbageDisposal.addDisposable(this);
        },

        /**
         * @protected
         */
        destroyModel: function() {
            this.detachAllObservers();
            this.clearProperties();
            this.garbageDisposal.removeDisposable(this);
        },

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
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(BugModel, IDisposable);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(BugModel).with(
        autowired().properties([
            property("garbageDisposal").ref("garbageDisposal")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmvc.BugModel', BugModel);
});
