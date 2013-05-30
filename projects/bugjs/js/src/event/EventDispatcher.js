//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('EventDispatcher')

//@Require('Class')
//@Require('EventListener')
//@Require('EventPropagator')
//@Require('IEventDispatcher')
//@Require('List')
//@Require('Map')
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
var EventPropagator     = bugpack.require('EventPropagator');
var IEventDispatcher    = bugpack.require('IEventDispatcher');
var List                = bugpack.require('List');
var Map                 = bugpack.require('Map');
var TypeUtil            = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

// NOTE BRN: The primary difference between an EventDispatcher and Publisher model is that in an EventDispatcher model
// the listener knows which object it is listening to, so it's very understood where the EventListener is receiving
// the event from. In a Publisher model, the 'listener' or receiver of a message does not know where the message originated
// from. So it is much more anonymous. This model is better for cases where any number of objects can send a message
// and you have fewer number of receivers of that message.

var EventDispatcher = Class.extend(EventPropagator, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(target) {

        this._super(target);


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
         * @type {IEventPropagator}
         */
        this.parentPropagator = undefined;
    },


    //-------------------------------------------------------------------------------
    // IEventDispatcher Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {IEventPropagator}
     */
    getParentPropagator: function() {
        return this.parentPropagator;
    },

    /**
     * @param {IEventPropagator} parentPropagator
     */
    setParentPropagator: function(parentPropagator) {
        this.parentPropagator = parentPropagator;
    },

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {?Object=} listenerContext (optional)
     * @param {?boolean=} once (optional)
     */
    addEventListener: function(eventType, listenerFunction, listenerContext, once) {
        var eventTypeListenerList = this.eventTypeListenerMap.get(eventType);
        if (!eventTypeListenerList) {
            eventTypeListenerList = new List();
            this.eventTypeListenerMap.put(eventType, eventTypeListenerList);
        }
        if(!TypeUtil.isBoolean(once)){
            once = false;
        } else if (TypeUtil.isBoolean(listenerContext)) {
            once = listenerContext;
        }
        var eventListener = new EventListener(listenerFunction, listenerContext, once);
        if (!eventTypeListenerList.contains(eventListener)) {
            eventTypeListenerList.add(eventListener);
        }
    },

    /**
     * @param {Event} event
     * @param {?boolean=} bubbles
     */
    dispatchEvent: function(event, bubbles) {
        if (bubbles === undefined) {
            bubbles = true;
        }
        event.setBubbles(bubbles);
        event.setTarget(this.getTarget());
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

    /**
     *
     */
    removeAllListeners: function() {
        this.eventTypeListenerMap.clear();
    },


    //-------------------------------------------------------------------------------
    // EventPropagator Overrides/Extensions
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {Event} event
     */
    propagateEvent: function(event) {
        if (!event.isPropagationStopped()) {
            event.setCurrentTarget(this.getTarget());
            this.propagateEventToListeners(event);
            this.propagateEventToPropagators(event);
            if (event.getBubbles()) {
                this.bubbleEvent(event);
            }
        }
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    off: function() {
        this.removeEventListener.apply(this, arguments);
    },

    /**
     *
     */
    on: function() {
        this.addEventListener.apply(this, arguments);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    bubbleEvent: function(event) {
        var parentPropagator = this.getParentPropagator();
        if (parentPropagator) {
            parentPropagator.propagateEvent(event);
        }
    },

    /**
     * @private
     * @param {Event} event
     */
    propagateEventToListeners: function(event) {
        var _this = this;
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
    },

    /**
     * @private
     * @param {Event} event
     */
    propagateEventToPropagators: function(event) {
        var cloneEventPropagatorList = this.eventPropagatorList.clone();
        cloneEventPropagatorList.forEach(function(eventPropagator) {
            eventPropagator.propagateEvent(event);
        });
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(EventDispatcher, IEventDispatcher);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('EventDispatcher', EventDispatcher);
