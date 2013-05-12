//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('EventListener')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Obj =   bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EventListener = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(listenerFunction, listenerContext, once) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(Event)}
         */
        this.listenerFunction = listenerFunction;

        /**
         * @private
         * @type {Object}
         */
        this.listenerContext = listenerContext;

        /**
         * @private
         * @type {boolean}
         */
        this.once = once;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, EventListener)) {
            return (value.getListenerFunction() === this.listenerFunction && value.getListenerContext() === this.listenerContext);
        }
        return false;
    },

    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[EventListener]" +
                Obj.hashCode(this.listenerFunction) + "_" +
                Obj.hashCode(this.listenerContext));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getListenerContext: function() {
        return this.listenerContext;
    },

    /**
     * @return {function(Event)}
     */
    getListenerFunction: function() {
        return this.listenerFunction;
    },

    /**
     * @return {boolean}
     */
    isOnce: function(){
        return this.once;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Event} event
     */
    hearEvent: function(event) {
        this.listenerFunction.call(this.listenerContext, event);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('EventListener', EventListener);
