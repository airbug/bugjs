//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugsub')

//@Export('Subscriber')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Subscriber = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(subscriberFunction, subscriberContext, once) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.once                   = once;

        /**
         * @private
         * @type {Object}
         */
        this.subscriberContext      = subscriberContext;

        /**
         * @private
         * @type {function(Message)}
         */
        this.subscriberFunction     = subscriberFunction;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    getOnce: function() {
        return this.once;
    },

    /**
     * @return {Object}
     */
    getSubscriberContext: function() {
        return this.subscriberContext;
    },

    /**
     * @return {function(Message)}
     */
    getSubscriberFunction: function() {
        return this.subscriberFunction;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {string} channel
     */
    receiveMessage: function(message, channel) {
        this.subscriberFunction.call(this.subscriberContext, message, channel);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugsub.Subscriber', Subscriber);
