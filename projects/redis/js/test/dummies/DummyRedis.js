//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('redis')

//@Export('DummyRedis')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('redis.DummyRedisClient')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var List                        = bugpack.require('List');
var Map                         = bugpack.require('Map');
var Obj                         = bugpack.require('Obj');
var Set                         = bugpack.require('Set');
var DummyRedisClient            = bugpack.require('redis.DummyRedisClient');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DummyRedis = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, List.<DummyRedisClient>>}
         */
        this.channelToClientListMap     = new Map();

        /**
         * @private
         * @type {Map.<string, *>}
         */
        this.keyToEntryMap              = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Map.<string, List.<DummyRedisClient>>}
     */
    getChannelToClientListMap: function() {
        return this.channelToClientListMap;
    },

    /**
     * @return {Map.<string, *>}
     */
    getKeyToEntryMap: function() {
        return this.keyToEntryMap;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} channel
     * @param {string} message
     * @return {number}
     */
    publishToChannel: function(channel, message) {
        var clientList  = this.channelToClientListMap.get(channel);
        if (clientList) {
            var cloneClientList = clientList.clone();
            setTimeout(function() {
                cloneClientList.forEach(function(client) {
                    client.receiveMessage(message, channel);
                });
            }, 0);
            return cloneClientList.getCount();
        }
        return 0;
    },

    /**
     * @param {string} channel
     * @param {DummyRedisClient} dummyRedisClient
     */
    subscribeToChannel: function(channel, dummyRedisClient) {
        var clientList = this.channelToClientListMap.get(channel);
        if (!clientList) {
            clientList = new List();
            this.channelToClientListMap.put(channel, clientList);
        }
        if (!clientList.contains(dummyRedisClient)) {
            clientList.add(dummyRedisClient);
        }
    },

    /**
     * @param {string} channel
     * @param {DummyRedisClient} dummyRedisClient
     */
    unsubscribeFromChannel: function(channel, dummyRedisClient) {
        var clientList = this.channelToClientListMap.get(channel);
        if (clientList) {
            clientList.remove(dummyRedisClient);
            if (clientList.isEmpty()) {
                this.channelToClientListMap.remove(channel);
            }
        }
    },


    //-------------------------------------------------------------------------------
    // Redis Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {number} port
     * @param {string} host
     * @return {DummyRedisClient}
     */
    createClient: function(port, host) {
        var client = new DummyRedisClient(this);
        setTimeout(function() {
            client.makeReady();
        }, 0);
        return client;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('redis.DummyRedis', DummyRedis);
