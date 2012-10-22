//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('View')

//@Require('Backbone');
//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('HashUtil')
//@Require('IEquals')
//@Require('IEventDispatcher')
//@Require('IHashCode')
//@Require('List')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var View = Class.adapt(Backbone.View, {

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
         * @type {boolean}
         */
        this.created = false;

        /**
         * @private
         * @type {List<View>}
         */
        this.viewChildList = new List();

        /**
         * @private
         * @type {EventDispatcher}
         */
        this.eventDispatcher = new EventDispatcher(this);

        this.cid = _.uniqueId('view');
        this._configure(options || {});
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
    // IEventDispatcher Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {?Object} listenerContext (optional)
     */
    addEventListener: function(eventType, listenerFunction, listenerContext) {
        this.eventDispatcher.addEventListener(eventType, listenerFunction, listenerContext);
    },

    /**
     * @param {Event} event
     * @param {?boolean=} bubbles
     */
    dispatchEvent: function(event, bubbles) {
        this.eventDispatcher.dispatchEvent(event, bubbles);
    },

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {Object} listenerContext
     */
    removeEventListener: function(eventType, listenerFunction, listenerContext) {
        this.eventDispatcher.removeEventListener(eventType, listenerFunction, listenerContext);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {View} viewChild
     */
    addViewChild: function(target, viewChild) {
        this.create();
        viewChild.create();
        this.$el.find(target).append(viewChild.el);
        this.viewChildList.add(viewChild);
    },

    /**
     *
     */
    create: function() {
        if (!this.created) {
            this.created = true;
            this.createView();
        }
    },

    /**
     *
     */
    destroy: function() {
        if (this.created) {
            this.created = false;
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
        this.initialize.apply(this, arguments);
        this.delegateEvents();
    },

    /**
     * @protected
     */
    destroyView: function() {
        this.undelegateEvents();
        this.remove();
    }
});
Class.implement(View, IEquals);
Class.implement(View, IHashCode);
