//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('aws')

//@Export('S3Object')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Obj =       bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var S3Object = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(params) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        //settable
        //gettable
        /**
         * @private
         * @type {string}
         */
        this.body = params.body;

        //settable
        //gettable
        /**
         * @private
         * @type {string}
         */
        this.cacheControl = params.cacheControl;

        //gettable
        //settable
        /**
         * @private
         * @type {string}
         */
        this.contentDisposition = params.contentDisposition;

        //gettable
        //settable
        /**
         * @private
         * @type {string}
         */
        this.contentEncoding = params.contentEncoding;

        //gettable
        //settable
        /**
         * @private
         * @type {string}
         */
        this.contentLanguage = params.contentLanguage;

        //gettable
        /**
         * @private
         * @type {number}
         */
        this.contentLength = params.contentLength;

        //gettable
        //settable
        /**
         * @private
         * @type {string}
         */
        this.contentType = params.contentType;

        //gettable
        /**
         * @private
         * @type {string}
         */
        this.deleteMarker = params.deleteMarker;

        //gettable
        /**
         * @private
         * @type {string}
         */
        this.eTag = params.eTag;

        //gettable
        /**
         * @private
         * @type {string}
         */
        this.expiration = params.expiration;

        //gettable
        //settable
        /**
         * @private
         * @type {string}
         */
        this.expires = params.expires;

        //gettable
        //settable
        /**
         * @private
         * @type {string}
         */
        this.key = params.key;

        //gettable
        /**
         * @private
         * @type {Date}
         */
        this.lastModified = params.lastModified;

        //gettable
        //settable
        /**
         * @private
         * @type {Object.<string>}
         */
        this.metaData = params.metaData;

        //gettable
        /**
         * @private
         * @type {number}
         */
        this.missingMeta = params.missingMeta;

        //gettable
        /**
         * @private
         * @type {string}
         */
        this.restore = params.restore;

        //gettable
        //settable
        /**
         * @private
         * @type {string}
         */
        this.serverSideEncryption = params.serverSideEncryption;

        //gettable
        /**
         * @private
         * @type {string}
         */
        this.versionId = params.versionId;

        //gettable
        //settable
        /**
         * @private
         * @type {string}
         */
        this.websiteRedirectLocation = params.websiteRedirectLocation;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getBody: function() {
        return this.body;
    },

    /**
     * @param {string} body
     */
    setBody: function(body) {
        this.body = body;
    },

    /**
     * @return {string}
     */
    getCacheControl: function() {
        return this.cacheControl;
    },

    /**
     * @param {string} cacheControl
     */
    setCacheControl: function(cacheControl) {
        this.cacheControl = cacheControl;
    },

    /**
     * @return {string}
     */
    getContentDisposition: function() {
        return this.contentDisposition;
    },

    /**
     * @param {string} contentDisposition
     */
    setContentDisposition: function(contentDisposition) {
        this.contentDisposition = contentDisposition;
    },

    /**
     * @return {string}
     */
    getContentEncoding: function() {
        return this.contentEncoding;
    },

    /**
     * @param {string} contentEncoding
     */
    setContentEncoding: function(contentEncoding) {
        this.contentEncoding = contentEncoding;
    },

    /**
     * @return {string}
     */
    getContentLanguage: function() {
        return this.contentLanguage;
    },

    /**
     * @param {string} contentLanguage
     */
    setContentLanguage: function(contentLanguage) {
        this.contentLanguage = contentLanguage;
    },

    /**
     * @return {number}
     */
    getContentLength: function() {
        return this.contentLength;
    },

    /**
     * @return {string}
     */
    getContentType: function() {
        return this.contentType;
    },

    /**
     * @param {string} contentType
     */
    setContentType: function(contentType) {
        this.contentType = contentType;
    },

    /**
     * @return {string}
     */
    getDeleteMarker: function() {
        return this.deleteMarker;
    },

    /**
     * @return {string}
     */
    getETag: function() {
        return this.eTag;
    },

    /**
     * @return {string}
     */
    getExpiration: function() {
        return this.expiration;
    },

    /**
     * @return {string}
     */
    getExpires: function() {
        return this.expires;
    },

    /**
     * @param {string} expires
     */
    setExpires: function(expires) {
        this.expires = expires;
    },

    /**
     * @return {string}
     */
    getKey: function() {
        return this.key;
    },

    /**
     * @return {Date}
     */
    getLastModified: function() {
        return this.lastModified;
    },

    /**
     * @return {Object.<string>}
     */
    getMetaData: function() {
        return this.metaData;
    },

    /**
     * @param {Object} metaData
     */
    setMetaData: function(metaData) {
        this.metaData = metaDate;
    },

    /**
     * @return {number}
     */
    getMissingMeta: function() {
        return this.missingMeta;
    },

    /**
     * @return {string}
     */
    getRestore: function() {
        return this.restore;
    },

    /**
     * @return {string}
     */
    getServerSideEncryption: function() {
        return this.serverSideEncryption;
    },

    /**
     * @param {string} serverSideEncryption
     */
    setServerSideEncryption: function(serverSideEncryption) {
        this.serverSideEncryption = serverSideEncryption;
    },

    /**
     * @return {string}
     */
    getVersionId: function() {
        return this.versionId;
    },

    /**
     * @return {string}
     */
    getWebsiteRedirectLocation: function() {
        return this.websiteRedirectLocation;
    },

    /**
     * @param {string} websiteRedirectLocation
     */
    setWebsiteRedirectLocation: function(websiteRedirectLocation) {
        this.websiteRedirectLocation = websiteRedirectLocation;
    }

    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aws.S3Object', S3Object);
