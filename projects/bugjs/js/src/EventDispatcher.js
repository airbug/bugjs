//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('EventDispatcher')

//@Require('Class')
//@Require('EventListener')
//@Require('IEventDispatcher')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventListener       = bugpack.require('EventListener');
var IEventDispatcher    = bugpack.require('IEventDispatcher');
var List                = bugpack.require('List');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var TypeUtil            = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

// NOTE BRN: The primary difference between an EventDispatcher and Publisher model is that in an EventDispatcher model
// the listener knows which object it is listening to, so it's very understood where the EventListener is receiving
// the event from. In a Publisher model, the 'listener' or receiver of a message does not know where the message originated
// from. So it is much more anonymous. This model is better for cases where any number of objects can send a message
// and you have fewer number of receivers of that message.

var EventDispatcher = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(target) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map}
         */
        this.eventTypeListenerMap = new Map();

        /**
         * @private
         * @type {EventDispatcher}
         */
        this.parentDispatcher = undefined;

        /**
         * @private
         * @type {*}
         */
        this.target = target ? target : this;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {EventDispatcher}
     */
    getParentDispatcher: function() {
        return this.parentDispatcher;
    },

    /**
     * @param {EventDispatcher} parentDispatcher
     */
    setParentDispatcher: function(parentDispatcher) {
        this.parentDispatcher = parentDispatcher;
    },

    /**
     * @return {*}
     */
    getTarget: function() {
        return this.target;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {?Object=} listenerContext (optional)
     * @param {?boolean=} isOnce (optional)
     */
    addEventListener: function(eventType, listenerFunction, listenerContext, isOnce) {
        var eventTypeListenerList = this.eventTypeListenerMap.get(eventType);
        if (!eventTypeListenerList) {
            eventTypeListenerList = new List();
            this.eventTypeListenerMap.put(eventType, eventTypeListenerList);
        }
        if(!TypeUtil.isBoolean(isOnce)){
            isOnce = false;
        } else if (TypeUtil.isBoolean(listenerContext)) {
            isOnce = listenerContext;
        }
        var eventListener = new EventListener(listenerFunction, listenerContext, isOnce);
        if (!eventTypeListenerList.contains(eventListener)) {
            eventTypeListenerList.add(eventListener);
        }
    },

    on: function() {
        this.addEventListener.apply(this, arguments);
    },

    /**
     * @param {Event} event
     * @param {?boolean=} bubbles
     */
    dispatchEvent: function(event, bubbles) {
        if (bubbles === undefined) {
            bubbles = true;
        }

        //NOTE BRN: These values are read only, but we sneakily set the value here.

        event.bubbles = bubbles;
        event.target = this.target;
        this.propagateEvent(event);
    },

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {?Object=} listenerContext (optional)
     */
    hasEventListener: function(eventType, listenerFunction, listenerContext) {
        var eventTypeListenerList = this.eventTypeListenerMap.get(eventType);
        if (eventTypeListenerList) {
            var eventListener = new EventListener(listenerFunction, listenerContext);
            return eventTypeListenerList.contains(eventListener);
        }
        return false;
    },

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {} listenerContext
     */
    onceOn: function(eventType, listenerFunction, listenerContext){
        this.addEventListener(eventType, listenerFunction, listenerContext, true);
    },

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {?Object=} listenerContext
     */
    removeEventListener: function(eventType, listenerFunction, listenerContext) {
        var eventTypeListenerList = this.eventTypeListenerMap.get(eventType);
        if (eventTypeListenerList) {
            var eventListener = new EventListener(listenerFunction, listenerContext);
            eventTypeListenerList.remove(eventListener);
        }
    },

    off: function() {
        this.removeEventListener.apply(this, arguments);
    },

    /**
     *
     */
    removeAllListeners: function() {
        this.eventTypeListenerMap.clear();
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Event} event
     */
    propagateEvent: function(event) {
        var _this = this;
        if (!event.isPropagationStopped()) {
            var eventTypeListenerList = this.eventTypeListenerMap.get(event.getType());
            if (eventTypeListenerList) {

                // NOTE BRN: Clone the event listener list so that if the list is changed during execution of the listeners
                // we still execute all of the listeners.

                var cloneEventTypeListenerList = eventTypeListenerList.clone();
                cloneEventTypeListenerList.forEach(function(eventListener) {
                    eventListener.hearEvent(event);
                    if (eventListener.isOnce()) {
                        _this.removeEventListener(event.getType(), eventListener.getListenerFunction(), eventListener.getListenerContext());
                    }
                });
            }
            if (event.getBubbles()) {
                var parentDispatcher = this.getParentDispatcher();
                if (parentDispatcher) {
                    parentDispatcher.propagateEvent(event);
                }
            }
        }
    }
});
Class.implement(EventDispatcher, IEventDispatcher);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('EventDispatcher', EventDispatcher);
