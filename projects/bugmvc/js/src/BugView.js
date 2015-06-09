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

//@Export('bugmvc.BugView')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Exception')
//@Require('HashUtil')
//@Require('IdGenerator')
//@Require('List')
//@Require('Obj')
//@Require('ObjectUtil')
//@Require('Proxy')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
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

    var Class                   = bugpack.require('Class');
    var Event                   = bugpack.require('Event');
    var EventDispatcher         = bugpack.require('EventDispatcher');
    var Exception               = bugpack.require('Exception');
    var HashUtil                = bugpack.require('HashUtil');
    var IdGenerator             = bugpack.require('IdGenerator');
    var List                    = bugpack.require('List');
    var Obj                     = bugpack.require('Obj');
    var ObjectUtil              = bugpack.require('ObjectUtil');
    var Proxy                   = bugpack.require('Proxy');
    var RemovePropertyChange    = bugpack.require('RemovePropertyChange');
    var SetPropertyChange       = bugpack.require('SetPropertyChange');
    var IDisposable             = bugpack.require('bugdispose.IDisposable');
    var AutowiredTag            = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag             = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired               = AutowiredTag.autowired;
    var bugmeta                 = BugMeta.context();
    var property                = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     * @implements {IDisposable}
     */
    var BugView = Class.extend(EventDispatcher, /** @lends {BugView.prototype} */{

        _name: "bugmvc.BugView",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} options
         */
        _constructor: function(options) {

            this._super();


            //-------------------------------------------------------------------------------
            // Public Properties
            //-------------------------------------------------------------------------------

            /**
             * @type {jQuery}
             */
            this.$el                = null;


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.attributes         = this.attributes ? Obj.clone(this.attributes, true) : {};

            /**
             * @private
             * @type {string}
             */
            this.cid                = "view" + IdGenerator.generateId();

            /**
             * @private
             * @type {Object}
             */
            this.config             = this.config ? Obj.clone(this.config, true) : {};

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
             * @type {string}
             */
            this.name               = null;

            /**
             * @private
             * @type {Object}
             */
            this.options            = options;

            /**
             * @private
             * @type {List.<BugView>}
             */
            this.viewChildList      = new List();

            /**
             * @private
             * @type {BugView}
             */
            this.viewParent         = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @param {string} name
         * @return {*}
         */
        getAttribute: function(name) {
            return this.attributes[name];
        },

        /**
         * @param {string} name
         * @param {*} value
         */
        setAttribute: function(name, value) {
            var currentAttribute = this.getAttribute(name);
            if (currentAttribute !== value) {
                this.attributes[name] = value;
                this.renderView();
            }
        },

        /**
         * @return {string}
         */
        getCid: function() {
            return this.cid;
        },

        /**
         * @return {BugModel}
         */
        getModel: function() {
            return this.model;
        },

        /**
         * @param {BugModel} model
         */
        setModel: function(model) {
            this.clearModel();
            if (model) {
                if (!model.isCreated()) {
                    model.create();
                }
                this.model = model;
                this.garbageDisposal.addReference(this, model);
            }
        },

        /**
         * @return {string}
         */
        getId: function() {
            return this.id;
        },

        /**
         * @return {string}
         */
        getName: function() {
            return this.name;
        },

        /**
         * @return {List.<BugView>}
         */
        getViewChildList: function() {
            return this.viewChildList;
        },

        /**
         * @return {BugView}
         */
        getViewParent: function() {
            return this.viewParent;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasName: function() {
            return !!this.name;
        },

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
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} selector
         * @return {jQuery}
         */
        $: function(selector) {
            return this.$el.find(selector);
        },

        /**
         * @param {BugView} viewChild
         * @param {?string=} domQuery
         */
        addViewChild: function(viewChild, domQuery) {
            if (!this.isCreated()) {
                this.create();
            }
            if (!viewChild.isCreated()) {
                viewChild.create();
            }
            viewChild.setParentPropagator(this);
            viewChild.viewParent = this;
            this.viewChildList.add(viewChild);
            this.garbageDisposal.addReference(this, viewChild);
            var targetEl = domQuery ? this.findElement(domQuery) : this.$el;
            if (targetEl.length == 0) {
                throw new Exception("NoDomElement", {}, "No DOM element found for domQuery (" + domQuery + ")");
            }
            targetEl.append(viewChild.el);
        },

        /**
         * @param {BugView} viewChild
         * @param {?string=} domQuery
         */
        addViewChildTo: function(viewChild, domQuery) {
            this.addViewChild(viewChild, domQuery);
        },

        /**
         *
         */
        clearModel: function() {
            if (this.model) {
                this.garbageDisposal.removeReference(this, this.model);
                this.model = null;
            }
        },

        /**
         *
         */
        create: function() {
            if (!this.created) {
                this.created = true;
                this.configureView();
                this.createView();
                this.initializeView();
            }
        },

        /**
         *
         */
        destroy: function() {
            if (this.created) {
                this.created = false;
                this.deinitializeView();
                this.destroyViewChildren();
                this.destroyView();
            }
        },

        //    BUGBUG
        //    /**
        //     * @param {BugView} viewChild
        //     * @param {number} index
        //     * @param {string} domQuery
        //     */
        //    addViewChildAt: function(viewChild, index, domQuery) {
        //        if (!this.isCreated()) {
        //            this.create();
        //        }
        //        if (!viewChild.isCreated()) {
        //            viewChild.create();
        //        }
        //        viewChild.setParentPropagator(this);
        //        viewChild.viewParent = this;
        //        this.viewChildList.addAt(index, viewChild);
        //        var targetEl = this.findElement(domQuery);
        //        if (targetEl.length == 0) {
        //            throw new Error("No DOM element found for domQuery (" + domQuery + " )");
        //        }
        //
        //        targetEl.eq(index).before(viewChild.el);
        //    },

        /**
         *
         */
        forceReflow: function() {
            var $el = this.$el;
            if ($el.size() > 0) {
                var element = $el[0];
                var previousDisplay = element.style.display;
                element.style.display = "none";
                element.offsetHeight; // no need to store this anywhere, the reference is enough
                element.style.display = previousDisplay;
            }
        },

        /**
         * @param {BugView} viewChild
         * @param {?string=} domQuery
         */
        prependViewChild: function(viewChild, domQuery) {
            if (!this.isCreated()) {
                this.create();
            }
            if (!viewChild.isCreated()) {
                viewChild.create();
            }
            viewChild.setParentPropagator(this);
            viewChild.viewParent = this;
            this.viewChildList.prepend(viewChild); //CHECK THIS
            var targetEl = domQuery ? this.findElement(domQuery) : this.$el;
            if (targetEl.length == 0) {
                throw new Exception("NoDomElement", {}, "No DOM element found for domQuery (" + domQuery + " )");
            }
            targetEl.prepend(viewChild.el);
        },

        /**
         * @param {BugView} viewChild
         * @param {?string=} domQuery
         */
        prependViewChildTo: function(viewChild, domQuery) {
            this.prependViewChild(viewChild, domQuery);
        },

        /**
         * @param {BugView} viewChild
         * @return {boolean}
         */
        hasViewChild: function(viewChild) {
            return this.viewChildList.contains(viewChild);
        },

        /**
         * @param {BugView} viewChild
         */
        removeViewChild: function(viewChild) {
            if (this.hasViewChild(viewChild)) {
                this.viewChildList.remove(viewChild);
                viewChild.viewParent = null;
                viewChild.setParentPropagator(null);
                this.garbageDisposal.removeReference(this, viewChild);
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        configureView: function() {
            var options = this.options || {};
            if (options.attributes) {
                ObjectUtil.merge(options.attributes, this.attributes);
                delete options.attributes;
            }
            if (options.config) {
                ObjectUtil.merge(options.config, this.config);
                delete options.config;
            }
            this.name   = options.name;

            var finalOptions = {};
            if (this.options) {
                ObjectUtil.merge(this.options, finalOptions);
            }
            if (options) {
                ObjectUtil.merge(options, finalOptions);
            }
            if (options.model) {
                this.setModel(options.model);
            }
            var viewOptions = ['el', 'id'];
            for (var i = 0, l = viewOptions.length; i < l; i++) {
                var attr = viewOptions[i];
                if (finalOptions[attr]) {
                    this[attr] = finalOptions[attr];
                }
            }
            this.options = finalOptions;
        },

        /**
         * @protected
         */
        createView: function() {
            this.garbageDisposal.addDisposable(this);
            this._ensureElement();
        },

        /**
         * @protected
         */
        deinitializeView: function() {
            this.removeAllListeners();
            if (this.model) {
                this.model.unobserve(RemovePropertyChange.CHANGE_TYPE, "*", this.observeModelRemovePropertyChange, this);
                this.model.unobserve(SetPropertyChange.CHANGE_TYPE, "*", this.observeModelSetPropertyChange, this);
            }
        },

        /**
         * @protected
         */
        destroyView: function() {
            this.removeAllListeners();
            this.remove();
            this.clearModel();
            if (this.viewParent) {
                this.viewParent.removeViewChild(this);
            }
            this.garbageDisposal.removeDisposable(this);
        },

        /**
         * @protected
         */
        destroyViewChildren: function() {
            var viewChildListClone = this.viewChildList.clone();
            viewChildListClone.forEach(function(viewChild) {
                viewChild.destroy();
            });
        },

        /**
         * @protected
         */
        initializeView: function() {
            if (this.model) {
                this.model.observe(RemovePropertyChange.CHANGE_TYPE, "*", this.observeModelRemovePropertyChange, this);
                this.model.observe(SetPropertyChange.CHANGE_TYPE, "*", this.observeModelSetPropertyChange, this);
            }
        },

        /**
         * @protected
         */
        renderAttributes: function() {
            var _this = this;
            ObjectUtil.forIn(this.attributes, function(attributeName, attributeValue) {
                _this.renderAttribute(attributeName, attributeValue);
            });
        },

        /**
         * @protected
         * @param {string} attributeName
         * @param {*} attributeValue
         */
        renderAttribute: function(attributeName, attributeValue) {

        },

        /**
         * @protected
         */
        renderView: function() {
            if (this.model) {
                this.renderModel();
            }
            if (this.attributes) {
                this.renderAttributes();
            }
        },

        /**
         * @protected
         */
        renderModel: function() {
            var _this = this;
            this.model.forIn(function(propertyName, propertyValue) {
                _this.renderModelProperty(propertyName, propertyValue);
            });
        },

        /**
         * @protected
         * @param {string} propertyName
         * @param {*} propertyValue
         */
        renderModelProperty: function(propertyName, propertyValue) {

        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        render: function() {

        },

        /**
         * @private
         */
        remove: function() {
            this.$el.remove();
            this.$el.off();
            this.$el = null;
            this.el = null;
        },

        /**
         * @abstract
         * @return {jQuery}
         */
        make: function() {
            //Override this yourself
        },

        /**
         * @private
         * @param {($ | Element)} element
         * @return {BugView}
         */
        setElement: function(element) {
            if (this.$el) {
                //TODO BRN: Handle removing event listeners from this element
            }
            this.$el = (element instanceof $) ? element : $(element);
            this.el = this.$el[0];
            return this;
        },

        /**
         * @private
         */
        _ensureElement: function() {
            if (!this.el) {
                var attrs = this.attributes || {};
                if (this.id) {
                    attrs.id = this.id;
                }
                if (this.className) {
                    attrs['class'] = this.className;
                }
                this.setElement(this.make());
            } else {
                this.setElement(this.el);
            }
        },


        //TODO BRN: We should improve the Proxy util to handle these cases.
        //-------------------------------------------------------------------------------
        // Proxy Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {(string | Object)} propertyName
         * @param {(string | number | function())=} value
         * @return {*}
         */
        css: function(propertyName, value) {
            return this.$el.css(propertyName, value);
        },

        /**
         * @param {string} domQuery
         * @return {jQuery}
         */
        findElement: function(domQuery) {
            domQuery = domQuery.replace("{{cid}}", this.getCid());
            domQuery = domQuery.replace("{{id}}", this.getId());
            return this.$el.find('*').andSelf().filter(domQuery);
        },

        /**
         *
         */
        focus: function() {
            this.$el.focus();
        },

        /**
         *
         */
        hide: function() {
            this.$el.hide();
        },

        /**
         *
         */
        show: function() {
            this.$el.show();
        },


        //-------------------------------------------------------------------------------
        // Observers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Observation} observation
         */
        observeModelRemovePropertyChange: function(observation) {
            this.renderModelProperty(observation.getObservationPath(), undefined);
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeModelSetPropertyChange: function(observation) {
            var change = /** @type {SetPropertyChange} */(observation.getChange());
            this.renderModelProperty(observation.getObservationPath(), change.getPropertyValue());
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(BugView, IDisposable);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(BugView).with(
        autowired().properties([
            property("garbageDisposal").ref("garbageDisposal")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmvc.BugView', BugView);
});
