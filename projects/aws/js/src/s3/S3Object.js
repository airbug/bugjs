/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('aws.S3Object')

//@Require('Class')
//@Require('aws.AwsObject')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var AwsObject   = bugpack.require('aws.AwsObject');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {AwsObject}
     */
    var S3Object = Class.extend(AwsObject, {

        _name: "aws.S3Object",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {} params
         */
        _constructor: function(params) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.body = params.body;

            /**
             * @private
             * @type {string}
             */
            this.cacheControl = params.cacheControl;

            /**
             * @private
             * @type {string}
             */
            this.contentDisposition = params.contentDisposition;

            /**
             * @private
             * @type {string}
             */
            this.contentEncoding = params.contentEncoding;

            /**
             * @private
             * @type {string}
             */
            this.contentLanguage = params.contentLanguage;

            /**
             * @private
             * @type {number}
             */
            this.contentLength = params.contentLength;

            /**
             * @private
             * @type {string}
             */
            this.contentType = params.contentType;

            /**
             * @private
             * @type {string}
             */
            this.deleteMarker = params.deleteMarker;

            /**
             * @private
             * @type {string}
             */
            this.eTag = params.eTag;

            /**
             * @private
             * @type {string}
             */
            this.expiration = params.expiration;

            /**
             * @private
             * @type {string}
             */
            this.expires = params.expires;

            /**
             * @private
             * @type {string}
             */
            this.key = params.key;

            /**
             * @private
             * @type {Date}
             */
            this.lastModified = params.lastModified;

            /**
             * @private
             * @type {Object.<string>}
             */
            this.metaData = params.metaData;

            /**
             * @private
             * @type {number}
             */
            this.missingMeta = params.missingMeta;

            /**
             * @private
             * @type {string}
             */
            this.restore = params.restore;

            /**
             * @private
             * @type {string}
             */
            this.serverSideEncryption = params.serverSideEncryption;

            /**
             * @private
             * @type {string}
             */
            this.versionId = params.versionId;

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
            if (this.cacheControl !== cacheControl) {
                this.setChangedFlag('cacheControl');
                this.cacheControl = cacheControl;
            }
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
            if (this.contentDisposition !== contentDisposition) {
                this.setChangedFlag('contentDisposition');
                this.contentDisposition = contentDisposition;
            }
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
            if (this.contentEncoding !== contentEncoding) {
                this.setChangedFlag('contentEncoding');
                this.contentEncoding = contentEncoding;
            }
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
            if (this.contentLanguage !== contentLanguage) {
                this.setChangedFlag('contentLanguage');
                this.contentLanguage = contentLanguage;
            }
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
            if (this.contentType !== contentType) {
                this.setChangedFlag('contentType');
                this.contentType = contentType;
            }
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
            if (this.expires !== expires) {
                this.setChangedFlag('expires');
                this.expires = expires;
            }
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
            //TODO BRN: don't think this will work
            this.setChangedFlag('metaData');
            this.metaData = metaData;
            /*if (this.metaData !== metaData) {
                this.metaData = metaData;
            }*/
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
            if (this.serverSideEncryption !== serverSideEncryption) {
                this.setChangedFlag('serverSideEncryption');
                this.serverSideEncryption = serverSideEncryption;
            }
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
            if (this.websiteRedirectLocation !== websiteRedirectLocation) {
                this.setChangedFlag('websiteRedirectLocation');
                this.websiteRedirectLocation = websiteRedirectLocation;
            }
        }

        //-------------------------------------------------------------------------------
        // Public Class Methods
        //-------------------------------------------------------------------------------
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('aws.S3Object', S3Object);
});
