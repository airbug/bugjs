//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('aws.EC2CidrIpRange')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('aws.AwsObject')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Obj =       bugpack.require('Obj');
var TypeUtil =  bugpack.require('TypeUtil');
var AwsObject = bugpack.require('aws.AwsObject');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EC2CidrIpRange = Class.extend(AwsObject, {

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
         * @type {?string}
         */
        this.cidrIp = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {?string}
     */
    getCidrIp: function() {
        return this.cidrIp;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, EC2CidrIpRange)) {
            return (value.getCidrIp() === this.getCidrIp());
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[EC2CidrIpRange]" + Obj.hashCode(this.getCidrIp()));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param  {{
     *  cidrIp: ?string
     * }} jsonObject
     */
    jsonCreate: function(jsonObject) {
        if (TypeUtil.isString(jsonObject.cidrIp)) {
            this.cidrIp = jsonObject.cidrIp;
        } else {
            this.cidrIp = undefined;
        }
    },

    /**
     * @protected
     * @param {{
     *  CidrIp: ?string
     * }} ipPermission
     */
    syncCreate: function(awsObject) {
        if (TypeUtil.isString(awsObject.cidrIp)) {
            this.cidrIp = awsObject.CidrIp;
        } else {
            this.cidrIp = undefined;
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aws.EC2CidrIpRange', EC2CidrIpRange);
