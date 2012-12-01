/**
 * Based on the google closure library.
 * http://closure-library.googlecode.com/svn/docs/class_goog_pubsub_PubSub.html
 */


//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('Publisher')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Message')
//@Require('Obj')
//@Require('PublisherSubscription')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('Publisher');

var Class = bugpack.require('Class');
var List = bugpack.require('List');
var Map = bugpack.require('Map');
var Message = bugpack.require('Message');
var Obj = bugpack.require('Obj');
var PublisherSubscription = bugpack.require('PublisherSubscription');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

// NOTE BRN: The primary difference between an EventDispatcher and Publisher model is that in an EventDispatcher model
// the listener knows which object it is listening to, so it's very understood where the EventListener is receiving
// the event from. In a Publisher model, the 'listener' or receiver of a message does not know where the message originated
// from. So it is much more anonymous. This model is better for cases where any number of objects can send a message
// and you have fewer number of receivers of that message.

var Publisher = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map<string, List<PublisherSubscription>>}
         */
        this.topicToPublisherSubscriptionListMap = new Map();

        /**
         * @private
         * @type {Map<string, PublisherSubscription>}
         */
        this.publisherSubscriptionIdToPublisherSubscriptionMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @param {string} topic
     * @return {number}
     */
    getCount: function(topic) {
        if (this.topicToPublisherSubscriptionListMap.containsKey(topic)) {
            var publisherSubscriptionList = this.topicToPublisherSubscriptionListMap.get(topic);
            return publisherSubscriptionList.getCount();
        }
        return 0;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} topic
     */
    clear: function(topic) {
        this.topicToPublisherSubscriptionListMap.remove(topic);
    },

    /**
     *
     */
    clearAll: function() {
        this.topicToPublisherSubscriptionListMap.clear();
        this.topicToPublisherSubscriptionListMap = new Map();
    },

    /**
     * @param {string} topic
     * @param {*} data
     * @return {boolean}
     */
    publish: function(topic, data) {
        if (this.topicToPublisherSubscriptionListMap.containsKey(topic)) {
            var message = new Message(topic, data);
            var oneTimeDeliveryPublisherSubscriptionList = new List();
            var publisherSubscriptionList = this.topicToPublisherSubscriptionListMap.get(topic);
            publisherSubscriptionList.forEach(function(publisherSubscription) {
                publisherSubscription.deliverMessage(message);
                if (publisherSubscription.isOneTimeDelivery()) {
                    oneTimeDeliveryPublisherSubscriptionList.add(publisherSubscription);
                }
            });
            var _this = this;
            oneTimeDeliveryPublisherSubscriptionList.forEach(function(publisherSubscription) {
                _this.removePublisherSubscription(publisherSubscription);
            });
            return true;
        }
        return false;
    },

    /**
     * Subscribing the same subscriber to the same topic will result in that subscriber being called multiple times.
     * @param {string} topic
     * @param {function(string, *)} subscriberFunction
     * @param {Object} subscriberContext
     * @return {string}
     */
    subscribe: function(topic, subscriberFunction, subscriberContext) {
        var publisherSubscription = new PublisherSubscription(topic, subscriberFunction, subscriberContext, false);
        return this.addPublisherSubscription(publisherSubscription);
    },

    /**
     * @param {string} topic
     * @param {function(string, *)} subscriberFunction
     * @param {Object} subscriberContext
     * @return {string}
     */
    subscribeOnce: function(topic, subscriberFunction, subscriberContext) {
        var publisherSubscription = new PublisherSubscription(topic, subscriberFunction, subscriberContext, true);
        return this.addPublisherSubscription(publisherSubscription);
    },

    /**
     * @param {string} topic
     * @param {function(string, *)} subscriberFunction
     * @param {Object} subscriberContext
     * @return {boolean}
     */
    unsubscribe: function(topic, subscriberFunction, subscriberContext) {
        var publisherSubscription = new PublisherSubscription(topic, subscriberFunction, subscriberContext, true);
        return this.removePublisherSubscription(publisherSubscription);
    },

    /**
     * @param {string} id
     * @return {boolean}
     */
    unsubscribeBySubscriptionId: function(id) {
        var publisherSubscription = this.publisherSubscriptionIdToPublisherSubscriptionMap.get(id);
        if (publisherSubscription) {
            return this.removePublisherSubscription(publisherSubscription);
        }
        return false;
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {PublisherSubscription} publisherSubscription
     */
    addPublisherSubscription: function(publisherSubscription) {

        // TODO BRN (QUESTION) Do we want multiple publisherSubscriptions of the same function and context to be able to
        // subscribe to a topic? If so we'd need to remove the hashCode override of the PublisherSubscription class.

        if (!this.publisherSubscriptionIdToPublisherSubscriptionMap.containsKey(publisherSubscription.getInternalId())) {
            var publisherSubscriptionList = this.topicToPublisherSubscriptionListMap.get(publisherSubscription.getTopic());
            if (publisherSubscriptionList === undefined) {
                publisherSubscriptionList = new List();
                this.topicToPublisherSubscriptionListMap.put(publisherSubscription.getTopic(), publisherSubscriptionList);
            }
            publisherSubscriptionList.add(publisherSubscription);
            this.publisherSubscriptionIdToPublisherSubscriptionMap.put(publisherSubscription.getInternalId(), publisherSubscription);
        }
        return publisherSubscription.getInternalId();
    },

    /**
     * @private
     * @param {PublisherSubscription} publisherSubscription
     */
    removePublisherSubscription: function(publisherSubscription) {
        if (this.publisherSubscriptionIdToPublisherSubscriptionMap.containsKey(publisherSubscription.getInternalId())) {
            this.publisherSubscriptionIdToPublisherSubscriptionMap.remove(publisherSubscription.getInternalId());
            var publisherSubscriptionList = this.topicToPublisherSubscriptionListMap.get(publisherSubscription.getTopic());
            publisherSubscriptionList.remove(publisherSubscription);
            return true;
        }
        return false;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(Publisher);
