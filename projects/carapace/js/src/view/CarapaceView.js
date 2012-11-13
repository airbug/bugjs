//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('CarapaceView')

//@Require('Backbone');
//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('HashUtil')
//@Require('IdGenerator')
//@Require('IDisposable')
//@Require('IEquals')
//@Require('IHashCode')
//@Require('List')
//@Require('Proxy')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CarapaceView = Class.adapt(Backbone.View, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(options) {

        //this._super(options);

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {number}
         */
        this._internalId = undefined;

        IdGenerator.injectId(this);

        /**
         * @private
         * @type {number}
         */
        this._hashCode = undefined;

        /**
         * @private
         * @type {Object}
         */
        this.attributes = {};

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
         * @type {$}
         */
        this.previousElParent = null;

        /**
         * @private
         * @type {EventDispatcher}
         */
        this.eventDispatcher = new EventDispatcher(this);

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
        this.cid = _.uniqueId('view');
        this._configure(options || {});

        Proxy.proxy(this, this.eventDispatcher, [
            "getParentDispatcher",
            "setParentDispatcher",
            "addEventListener",
            "dispatchEvent",
            "removeEventListener"
        ]);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getId: function() {
        return this.id;
    },

    /**
     * @return {List<CarapaceView}
     */
    getViewChildList: function() {
        return this.viewChildList;
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
        viewChild.setParentDispatcher(this.eventDispatcher);
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
     */
    createView: function() {
        this._ensureElement();
        this.delegateEvents();
    },

    /**
     * @protected
     */
    deinitializeView: function() {

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
            this.model.bind('change', this.handleModelChange, this);
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
        var changedAttributes = this.model.changedAttributes();
        for (var attributeName in changedAttributes) {
            this.renderModelAttribute(attributeName, changedAttributes[attributeName]);
        }
    },

    /**
     * @protected
     * @param {string} attributeName
     * @param {string} attributeValue
     */
    renderModelAttribute: function(attributeName, attributeValue) {

    },


    //TODO BRN: We should improve the Proxy util to handle these cases.
    //-------------------------------------------------------------------------------
    // Proxy Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} domQuery
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
    // Model Event Hanlders
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    handleModelChange: function() {
        this.renderView();
    }
});
Class.implement(CarapaceView, IDisposable);
Class.implement(CarapaceView, IEquals);
Class.implement(CarapaceView, IHashCode);
