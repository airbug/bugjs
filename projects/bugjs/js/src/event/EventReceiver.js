//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('EventReceiver')

//@Require('Class')
//@Require('EventListener')
//@Require('EventPropagator')
//@Require('EventQueryBuilder')
//@Require('IEventReceiver')
//@Require('List')
//@Require('Map')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventListener       = bugpack.require('EventListener');
var EventPropagator     = bugpack.require('EventPropagator');
var EventQueryBuilder   = bugpack.require('EventQueryBuilder');
var IEventReceiver      = bugpack.require('IEventReceiver');
var List                = bugpack.require('List');
var Map                 = bugpack.require('Map');
var TypeUtil            = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {EventPropagator}
 * @implements {IEventReceiver}
 */
var EventReceiver = Class.extend(EventPropagator, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {*} target
     */
    _constructor: function(target) {

        this._super(target);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, List.<EventListener>>}
         */
        this.eventTypeListenerMap   = new Map();

        /**
         * @private
         * @type {IEventPropagator}
         */
        this.parentPropagator       = undefined;
    },


    //-------------------------------------------------------------------------------
    // IEventReceiver Implementation
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
     * @param {(string | Array.<string>)} eventTypes
     * @param {function(Event)=} listenerFunction
     * @param {Object=} listenerContext (optional)
     * @param {boolean=} once (optional)
     * @return {(undefined | EventQueryBuilder)}
     */
    addEventListener: function(eventTypes, listenerFunction, listenerContext, once) {
        if (eventTypes && !listenerFunction) {
            return this.generateEventQueryBuilder(eventTypes);
        } else {
            this.buildEventListeners(eventTypes, listenerFunction, listenerContext, once);
        }
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
     * @return {boolean}
     */
    isListening: function(eventType) {
        var eventTypeListenerList = this.eventTypeListenerMap.get(eventType);
        if (eventTypeListenerList) {
            return true;
        }
        return false;
    },

    /**
     * @param {(string | Array.<string>)} eventTypes
     * @param {function(Event)} listenerFunction
     * @param {Object} listenerContext
     * @return {(undefined | EventQuery)}
     */
    onceOn: function(eventTypes, listenerFunction, listenerContext) {
        return this.addEventListener(eventTypes, listenerFunction, listenerContext, true);
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
            if (eventTypeListenerList.isEmpty()) {
                this.eventTypeListenerMap.remove(eventType);
            }
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
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} eventType
     * @param {EventListener} eventListener
     */
    attachEventListener: function(eventType, eventListener) {
        var eventTypeListenerList = this.eventTypeListenerMap.get(eventType);
        if (!eventTypeListenerList) {
            eventTypeListenerList = new List();
            this.eventTypeListenerMap.put(eventType, eventTypeListenerList);
        }
        if (!eventTypeListenerList.contains(eventListener)) {
            eventTypeListenerList.add(eventListener);
        }
    },

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
    // Private Methods
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
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {(Object | boolean)=} listenerContext
     * @param {boolean=} once
     */
    buildEventListener: function(eventType, listenerFunction, listenerContext, once) {
        if (!TypeUtil.isBoolean(once)) {
            once = false;
            if (TypeUtil.isBoolean(listenerContext)) {
                once = listenerContext;
            }
        }
        var eventListener = new EventListener(listenerFunction, listenerContext, once);
        this.attachEventListener(eventType, eventListener);
    },

    /**
     * @param {(string | Array.<string>)} eventTypes
     * @param {function(Event)} listenerFunction
     * @param {Object=} listenerContext
     * @param {boolean=} once
     */
    buildEventListeners: function(eventTypes, listenerFunction, listenerContext, once) {
        var _this = this;
        if (TypeUtil.isArray(eventTypes)) {
            eventTypes.forEach(function(type) {
                _this.buildEventListener(type, listenerFunction, listenerContext, once);
            });
        } else {
            this.buildEventListener(eventTypes, listenerFunction, listenerContext, once);
        }
    },

    /**
     * @param {(string | Array.<string>)} eventTypes
     * @returns {EventQueryBuilder}
     */
    generateEventQueryBuilder: function(eventTypes) {
        return new EventQueryBuilder(this, eventTypes);
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
        var cloneEventPropagatorList = this.getEventPropagatorList().clone();
        cloneEventPropagatorList.forEach(function(eventPropagator) {
            eventPropagator.propagateEvent(event);
        });
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(EventReceiver, IEventReceiver);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('EventReceiver', EventReceiver);
