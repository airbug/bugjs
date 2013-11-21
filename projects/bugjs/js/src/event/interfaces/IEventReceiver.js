//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IEventReceiver')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Interface           = bugpack.require('Interface');


//-------------------------------------------------------------------------------
// Declare Interface
//-------------------------------------------------------------------------------

/**
 * @interface
 */
var IEventReceiver = Interface.declare({

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {IEventPropagator}
     */
    getParentPropagator: function() {},

    /**
     * @param {IEventPropagator} parentPropagator
     */
    setParentPropagator: function(parentPropagator) {},

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {?Object=} listenerContext (optional)
     * @param {boolean=} once
     */
    addEventListener: function(eventType, listenerFunction, listenerContext, once) {},

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {?Object} listenerContext (optional)
     */
    hasEventListener: function(eventType, listenerFunction, listenerContext) {},

    /**
     *
     */
    removeAllListeners: function() {},

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {Object} listenerContext
     */
    removeEventListener: function(eventType, listenerFunction, listenerContext) {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('IEventReceiver', IEventReceiver);
