//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('carapace')

//@Export('CarapaceView')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('HashUtil')
//@Require('IdGenerator')
//@Require('IEquals')
//@Require('IHashCode')
//@Require('List')
//@Require('Obj')
//@Require('Proxy')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('backbone.Backbone')
//@Require('carapace.IDisposable')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Event                   = bugpack.require('Event');
var EventDispatcher         = bugpack.require('EventDispatcher');
var HashUtil                = bugpack.require('HashUtil');
var IdGenerator             = bugpack.require('IdGenerator');
var IEquals                 = bugpack.require('IEquals');
var IHashCode               = bugpack.require('IHashCode');
var List                    = bugpack.require('List');
var Obj                     = bugpack.require('Obj');
var Proxy                   = bugpack.require('Proxy');
var RemovePropertyChange    = bugpack.require('RemovePropertyChange');
var SetPropertyChange       = bugpack.require('SetPropertyChange');
var Backbone                = bugpack.require('backbone.Backbone');
var IDisposable             = bugpack.require('carapace.IDisposable');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

//TODO BRN: Remove the dependency upon Backbone and create our own simple MVC framework instead

/**
 * @class
 */
var CarapaceView = Class.adapt(Backbone.View, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(options) {

        //this._super(options);

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {number}
         */
        this._internalId = undefined;

        IdGenerator.ensureId(this);

        /**
         * @private
         * @type {number}
         */
        this._hashCode = undefined;

        /**
         * @private
         * @type {Object}
         */
        this.attributes = this.attributes ? Obj.clone(this.attributes, true) : {};

        /**
         * @private
         * @type {boolean}
         */
        this.created = false;

        /**
         * @private
         * @type {boolean}
         */
        this.disposed = false;

        /**
         * @private
         * @type {EventDispatcher}
         */
        this.eventDispatcher = new EventDispatcher(this);

        /**
         * @private
         * @type {string}
         */
        this.name               = null;

        /**
         * @private
         * @type {$}
         */
        this.previousElParent = null;

        /**
         * @private
         * @type {List<CarapaceView>}
         */
        this.viewChildList = new List();

        /**
         * @private
         * @type {CarapaceView}
         */
        this.viewParent = null;

        /**
         * @private
         * @type {string}
         */
        this.cid = "";

        Proxy.proxy(this, this.eventDispatcher, [
            "getParentPropagator",
            "setParentPropagator",
            "addEventListener",
            "dispatchEvent",
            "removeEventListener"
        ]);

        this.configure(options);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @param {string} name
     * @returns {*}
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
     * @returns {string}
     */
    getCid: function() {
        return this.cid;
    },

    /**
     * @return {CarapaceModel}
     */
    getModel: function() {
        return this.model;
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
     * @return {List.<CarapaceView>}
     */
    getViewChildList: function() {
        return this.viewChildList;
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
        if (!this.disposed) {
            this.disposed = true;
            this.destroy();
        }
    },


    //-------------------------------------------------------------------------------
    // IEquals Implementation
    //-------------------------------------------------------------------------------

    /**
     * If two Objs are equal then they MUST return the same hashCode. Otherwise the world will end!
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (value !== null && value !== undefined) {
            return (value._internalId === this._internalId);
        }
        return false;
    },


    //-------------------------------------------------------------------------------
    // IHashCode Implementation
    //-------------------------------------------------------------------------------

    /**
     * Equal hash codes do not necessarily guarantee equality.
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = HashUtil.hash(this);
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {CarapaceView} viewChild
     * @param {?string=} domQuery
     */
    addViewChild: function(viewChild, domQuery) {
        if (!this.isCreated()) {
            this.create();
        }
        if (!viewChild.isCreated()) {
            viewChild.create();
        }
        viewChild.setParentPropagator(this.eventDispatcher);
        viewChild.viewParent = this;
        this.viewChildList.add(viewChild);
        var targetEl = domQuery ? this.findElement(domQuery) : this.$el;
        if (targetEl.length == 0) {
            throw new Error("No DOM element found for domQuery (" + domQuery + " )");
        }
        targetEl.append(viewChild.el);
    },

    /**
     * @param {CarapaceView} viewChild
     * @param {?string=} domQuery
     */
    addViewChildTo: function(viewChild, domQuery) {
        this.addViewChild(viewChild, domQuery);
    },

    /**
     * @param {CarapaceView} viewChild
     * @param {number} index
     * @param {string} domQuery
     */
    addViewChildAt: function(viewChild, index, domQuery) {
        if (!this.isCreated()) {
            this.create();
        }
        if (!viewChild.isCreated()) {
            viewChild.create();
        }
        viewChild.setParentPropagator(this.eventDispatcher);
        viewChild.viewParent = this;
        this.viewChildList.addAt(index, viewChild);
        var targetEl = this.findElement(domQuery);
        if (targetEl.length == 0) {
            throw new Error("No DOM element found for domQuery (" + domQuery + " )");
        }

        targetEl.eq(index).before(viewChild.el);
    },

    /**
     * @param {CarapaceView} viewChild
     * @param {?string=} domQuery
     */
    prependViewChild: function(viewChild, domQuery) {
        if (!this.isCreated()) {
            this.create();
        }
        if (!viewChild.isCreated()) {
            viewChild.create();
        }
        viewChild.setParentPropagator(this.eventDispatcher);
        viewChild.viewParent = this;
        this.viewChildList.prepend(viewChild); //CHECK THIS
        var targetEl = domQuery ? this.findElement(domQuery) : this.$el;
        if (targetEl.length == 0) {
            throw new Error("No DOM element found for domQuery (" + domQuery + " )");
        }
        targetEl.prepend(viewChild.el);
    },

    /**
     * @param {CarapaceView} viewChild
     * @param {?string=} domQuery
     */
    prependViewChildTo: function(viewChild, domQuery) {
        this.prependViewChild(viewChild, domQuery);
    },

    /**
     * @param {CarapaceView} viewChild
     * @return {boolean}
     */
    hasViewChild: function(viewChild) {
        return this.viewChildList.contains(viewChild);
    },

    /**
     * @param {CarapaceView} viewChild
     */
    removeViewChild: function(viewChild) {
        if (this.hasViewChild(viewChild)) {
            this.viewChildList.remove(viewChild);
            viewChild.viewParent = null;
        }
    },

    /**
     *
     */
    create: function() {
        if (!this.created && !this.disposed) {
            this.created = true;
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


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Object} options
     */
    configure: function(options) {
        options = options || {};
        this.cid = _.uniqueId('view');
        if (options.attributes) {
            Obj.merge(options.attributes, this.attributes);
            delete options.attributes;
        }
        this.name   = options.name;
        this._configure(options);
    },

    /**
     * @protected
     */
    createView: function() {
        this._ensureElement();
        this.delegateEvents();
    },

    /**
     * @protected
     */
    deinitializeView: function() {
        this.eventDispatcher.removeAllListeners();
        if (this.model) {
            this.model.unobserve(RemovePropertyChange.CHANGE_TYPE, "*", this.observeModelRemovePropertyChange, this);
            this.model.unobserve(SetPropertyChange.CHANGE_TYPE, "*", this.observeModelSetPropertyChange, this);
        }
    },

    /**
     * @protected
     */
    destroyView: function() {
        this.undelegateEvents();
        this.remove();
        this.model = null;
        this.collection = null;
        if (this.viewParent) {
            this.viewParent.removeViewChild(this);
        }
    },

    /**
     * @protected
     */
    destroyViewChildren: function() {
        var viewChildListClone = this.viewChildList.clone();
        viewChildListClone.forEach(function(viewChild) {
            viewChild.dispose();
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
    renderView: function() {
        if (this.model) {
            this.renderModel();
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

    //TODO BRN: We should improve the Proxy util to handle these cases.
    //-------------------------------------------------------------------------------
    // Proxy Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} domQuery
     * @return {$}
     */
    findElement: function(domQuery) {
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
     * @param {RemovePropertyChange} change
     */
    observeModelRemovePropertyChange: function(change) {
        this.renderModelProperty(change.getObjectPath());
    },

    /**
     * @private
     * @param {SetPropertyChange} change
     */
    observeModelSetPropertyChange: function(change) {
        this.renderModelProperty(change.getObjectPath(), change.getPropertyValue());
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(CarapaceView, IDisposable);
Class.implement(CarapaceView, IEquals);
Class.implement(CarapaceView, IHashCode);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('carapace.CarapaceView', CarapaceView);
