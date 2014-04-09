//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('riak.RiakDb')

//@Require('Map')
//@Require('TypeUtil');


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();
var riakJs = require('riak-js');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Map =       bugpack.require('Map');
var TypeUtil =  bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RiakDb = {

    //-------------------------------------------------------------------------------
    // Static Variables
    //-------------------------------------------------------------------------------

    // TODO BRN: This cache will go stale if there is an update to a test made by another machine. We will want to
    // provide a way for flushing the cache when a change to a test is made. Perhaps using Redis to broadcast a
    // cache flush message.

    /**
     * @static
     * @private
     * @type {Map.<string, *>}
     */
    cache: new Map(),

    /**
     * @static
     * @private
     * @type {Object}
     */
    config: null,

    /**
     * @static
     * @private
     * @type {RiakClient}
     */
    riakClient: null,


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    clearCache: function() {
        RiakDb.cache.clear();
        console.log("RiakDb cache cleared");
    },

    /**
     * @static
     * @param config
     */
    configure: function(config) {
        RiakDb.config = config;
        RiakDb.connect();
    },

    /**
     * @static
     */
    connect: function() {
        RiakDb.riakClient = riakJs.getClient({
            host: RiakDb.config.riakHost,
            port: RiakDb.config.riakPort
        });
    },

    /**
     * @static
     * @param {string} bucket
     * @param {string} key
     * @param {Object=} meta
     * @param {function(Error, *, Object)=} callback
     */
    get: function(bucket, key, meta, callback) {
        if (!TypeUtil.isString(bucket)) {
            if (callback) {
                callback(new Error("'bucket' must be a string. Instead found:", bucket));
            } else {
                throw new Error("'bucket' must be a string. Instead found:", bucket);
            }
        }
        if (!TypeUtil.isString(key)) {
            if (callback) {
                callback(new Error("'key' must be a string. Instead found:", key));
            } else {
                throw new Error("'key' must be a string. Instead found:", key);
            }
        }
        if (TypeUtil.isFunction(meta)) {
            callback = meta;
            meta = null;
        }

        var cache = RiakDb.getFromCache(bucket, key);
        if (cache) {
            if (callback) {
                callback(null, cache.result, cache.meta);
            }
        } else {
            RiakDb.riakClient.get(bucket, key, meta, function(error, result, meta) {
                if (!error) {
                    RiakDb.putToCache(bucket, key, {
                        result: result,
                        meta: meta
                    });
                    if (callback) {
                        callback(null, result, meta);
                    }
                } else {
                    if (error.notFound === true) {
                        if (callback) {
                            callback(null, null, null);
                        }
                    } else {
                        if (callback) {
                            callback(error, null, null);
                        }
                    }
                }
            });
        }
    },

    /**
     * @static
     * @return {Array.<Object>}
     */
    getAll: function(bucket, meta, callback) {
        if (!TypeUtil.isString(bucket)) {
            if (callback) {
                callback(new Error("'bucket' must be a string. Instead found:", bucket));
            } else {
                throw new Error("'bucket' must be a string. Instead found:", bucket);
            }
        }
        if (TypeUtil.isFunction(meta)) {
            callback = meta;
            meta = null;
        }
        RiakDb.riakClient.getAll(bucket, meta, function(error, result, meta) {
            if (!error) {
                callback(null, result, meta);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @static
     * @param bucket
     * @return {*}
     */
    mapReduce: function(bucket) {
        return this.riakClient.mapreduce.add(bucket);
    },

    /**
     * @static
     * @param {string} bucket
     * @param {string} key
     * @param {Object} meta
     * @param {function(Error)} callback
     */
    remove: function(bucket, key, meta, callback) {
        if (!TypeUtil.isString(bucket)) {
            if (callback) {
                callback(new Error("'bucket' must be a string. Instead found:", bucket));
            } else {
                throw new Error("'bucket' must be a string. Instead found:", bucket);
            }
        }
        if (!TypeUtil.isString(key)) {
            if (callback) {
                callback(new Error("'key' must be a string. Instead found:", key));
            } else {
                throw new Error("'key' must be a string. Instead found:", key);
            }
        }
        if (TypeUtil.isFunction(meta)) {
            callback = meta;
            meta = null;
        }
        RiakDb.riakClient.remove(bucket, key, meta, function(error, result, meta) {
            if (!error) {
                if (callback) {
                    callback(null, result, meta);
                }
            } else {
                if (callback) {
                    callback(error);
                }
            }
        });
    },

    /**
     * @static
     * @param {string} bucket
     * @param {string} key
     * @param {*} value
     * @param {Object=} meta
     * @param {function(Error, *, Object)=} callback
     */
    save: function(bucket, key, value, meta, callback) {
        if (TypeUtil.isFunction(meta)) {
            callback = meta;
            meta = null;
        }
        RiakDb.riakClient.save(bucket, key, value, meta, function(error, result, meta) {
            if (!error) {
                RiakDb.removeFromCache(bucket, key);
                if (callback) {
                    callback(null, result, meta);
                }
            } else {
                if (callback) {
                    callback(error, null, null);
                } else {
                    console.log(error);
                }
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Private Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @private
     * @param {string} bucket
     * @param {string} key
     */
    getFromCache: function(bucket, key) {
        var bucketCache = RiakDb.cache.get(bucket);
        if (bucketCache) {
            return bucketCache.get(key);
        }
        return null;
    },

    /**
     * @static
     * @private
     * @param {string} bucket
     * @param {string} key
     * @param {*} value
     */
    putToCache: function(bucket, key, value) {
        var bucketCache = RiakDb.cache.get(bucket);
        if (!bucketCache) {
            bucketCache = new Map();
            RiakDb.cache.put(bucket, bucketCache);
        }
        bucketCache.put(key, value);
    },

    /**
     * @static
     * @private
     * @param {string} bucket
     * @param {string} key
     */
    removeFromCache: function(bucket, key) {
        var bucketCache = RiakDb.cache.get(bucket);
        if (bucketCache) {
            bucketCache.remove(key);
            if (bucketCache.isEmpty()) {
                RiakDb.cache.remove(bucket);
            }
        }
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('riak.RiakDb', RiakDb);
