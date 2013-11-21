//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Url')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require(('UrlQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var TypeUtil            = bugpack.require('TypeUtil');
var UrlQuery            = bugpack.require('UrlQuery');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var Url = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {{
     *      host: ?string,
     *      path: ?string,
     *      port: ?number,
     *      protocol: ?string,
     *      ref
     * }} options
     */
    _constructor: function(options) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {?string}
         */
        this.host               = "";

        /**
         * @private
         * @type {?string}
         */
        this.path               = "";

        /**
         * @private
         * @type {?number}
         */
        this.port               = 80;

        /**
         * @private
         * @type {?string}
         */
        this.protocol           = "http://";

        /**
         * @private
         * @type {?string}
         */
        this.ref                = "";

        /**
         * @private
         * @type {Map.<string, UrlQuery>}
         */
        this.urlQueryMap        = new Map();


        if (TypeUtil.isObject(options)) {
            var _this = this;
            this.setHost(options.host);
            this.setPath(options.path);
            this.setPort(options.port);
            this.setProtocol(options.protocol);
            this.setRef(options.ref);
            Obj.forIn(options.urlQueryMap, function(key,value) {
                _this.addUrlQuery(key, value);
            });
        }
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {?string}
     */
    getHost: function() {
        return this.host;
    },

    /**
     * @param {string} host
     * @return {Url}
     */
    setHost: function(host) {
        this.host = host;
        return this;
    },

    /**
     * @returns {?string}
     */
    getPath: function() {
        return this.path;
    },

    /**
     * @param {string} path
     * @return {Url}
     */
    setPath: function(path) {
        if (!TypeUtil.is)
        this.path = path;
        return this;
    },

    /**
     * @returns {number}
     */
    getPort: function() {
        return this.port;
    },

    /**
     * @param {?number} port
     * @return {Url}
     */
    setPort: function(port) {
        if (!TypeUtil.isNumber(port) || port <= 0) {
            port = 80;
        }
        this.port = port;
        return this;
    },

    /**
     * @returns {string}
     */
    getProtocol: function() {
        return this.protocol;
    },

    /**
     * @param {?string} protocol
     * @return {Url}
     */
    setProtocol: function(protocol) {
        this.protocol = protocol;
        return this;
    },

    /**
     * @returns {string}
     */
    getRef: function() {
        return this.ref;
    },

    /**
     * @param {?string} ref
     * @return {Url}
     */
    setRef: function(ref) {
        this.ref = ref;
        return this;
    },


    //-------------------------------------------------------------------------------
    // Obj Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {Url}
     */
    clone: function(deep) {
        var urlQueryMap = {};
        this.urlQueryMap.forEach(function(urlQuery) {
            urlQueryMap[urlQuery.getQueryKey()] = urlQuery.getQueryValue();
        });

        var options = {
            host: this.getHost(),
            path: this.getPath(),
            port: this.getPort(),
            protocol: this.getProtocol(),
            ref: this.getRef(),
            urlQueryMap: urlQueryMap
        };
        return new Url(options);
    },

    /**
     * @return {string}
     */
    toString: function() {
        var output = "";
        output += this.getProtocol() + "://";
        output += this.getHost();
        if (this.getPort() && this.getPort() !== 80) {
            output += ":" + this.getPort();
        }
        if (this.getPath()) {
            output += "/" + this.getPath();
        }
        if (!this.urlQueryMap.isEmpty()) {
            output += "?";
            var first = true;
            this.urlQueryMap.forEach(function(urlQuery) {
                if (first) {
                    first = false;
                    output += urlQuery.getQueryKey() + "=" + encodeURIComponent(urlQuery.getQueryValue());
                } else {
                    output += "&" +urlQuery.getQueryKey() + "=" + encodeURIComponent(urlQuery.getQueryValue());
                }
            });
        }
        if (this.getRef()) {
            output += "#";
            output += this.getRef();
        }
        return output;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} key
     * @param {*} value
     * @return {Url}
     */
    addUrlQuery: function(key, value) {
        var urlQuery    = new UrlQuery(key, value);
        this.urlQueryMap.put(key, urlQuery);
        return this;
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {string} urlString
 * @return {Url}
 */
Url.parse = function(urlString) {
    //TODO BRN
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Url', Url);
