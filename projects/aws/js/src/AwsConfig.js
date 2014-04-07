//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('aws.AwsConfig')

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
var Obj = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AwsConfig = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(params) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.accessKeyId = params.accessKeyId;

        /**
         * @private
         * @type {string}
         */
        this.region = params.region;

        /**
         * @private
         * @type {string}
         */
        this.secretAccessKey = params.secretAccessKey;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getAccessKeyId: function() {
        return this.accessKeyId;
    },

    /**
     * @return {string}
     */
    getRegion: function() {
        return this.region;
    },

    /**
     * @return {string}
     */
    getSecretAccessKey: function() {
        return this.secretAccessKey;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, AwsConfig)) {
            return (
                value.getAccessKeyId() === this.getAccessKeyId() &&
                value.getRegion() === this.getRegion() &&
                value.getSecretAccessKey() === this.getSecretAccessKey()
            );
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[AwsConfig]" + Obj.hashCode(this.getAccessKeyId()) + "_" +
                Obj.hashCode(this.getRegion()) + Obj.hashCode(this.getSecretAccessKey()));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {{
     *      accessKeyId: string,
     *      region: string,
     *      secretAccessKey: string
     * }}
     */
    toAWSObject: function() {
        var awsObject = {};
        if (this.accessKeyId) {
            awsObject.accessKeyId = this.accessKeyId;
        }
        if (this.region) {
            awsObject.region = this.region;
        }
        if (this.secretAccessKey) {
            awsObject.secretAccessKey = this.secretAccessKey;
        }
        return awsObject;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aws.AwsConfig', AwsConfig);
