//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('EventListener')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


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

    _constructor: function(listenerFunction, listenerContext) {

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
         * @type {boolean}
         */
        this.once = false;
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
            return (value.listenerFunction === this.listenerFunction && value.listenerContext === this.listenerContext);
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
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Event} event
     */
    hearEvent: function(event) {
        this.listenerFunction.call(this.listenerContext, event);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isOnce: function(){
        return this.once;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('EventListener', EventListener);
