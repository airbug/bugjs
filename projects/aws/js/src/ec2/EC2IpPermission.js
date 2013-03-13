//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('aws')

//@Export('EC2IpPermission')

//@Require('Class')
//@Require('List')
//@Require('aws.AwsObject')
//@Require('aws.EC2CidrIpRange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var List =                  bugpack.require('List');
var AwsObject =             bugpack.require('aws.AwsObject');
var EC2CidrIpRange =        bugpack.require('aws.EC2CidrIpRange');
var EC2UserIdGroupPair =    bugpack.require('aws.EC2UserIdGroupPair');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EC2IpPermission = Class.extend(AwsObject, {

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
         * @type {?number}
         */
        this.fromPort = null;

        /**
         * @private
         * @type {?string}
         */
        this.ipProtocol = null;

        /**
         * @private
         * @type {List.<EC2CidrIpRange>}
         */
        this.ipRanges = new List();

        /**
         * @private
         * @type {?number}
         */
        this.toPort = null;

        /**
         * @private
         * @type {List.<EC2UserIdGroupPair>}
         */
        this.userIdGroupPairs = new List();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {?number}
     */
    getFromPort: function() {
        return this.fromPort;
    },

    /**
     * @param {number} fromPort
     */
    setFromPort: function(fromPort) {
        if (this.fromPort !== fromPort) {
            this.setChangedFlag('fromPort');
            this.fromPort = fromPort;
        }
    },

    /**
     * @return {?string}
     */
    getIpProtocol: function() {
        return this.ipProtocol;
    },

    /**
     * @param {string} ipProtocol
     */
    setIpProtocol: function(ipProtocol) {
        if (this.ipProtocol !== ipProtocol) {
            this.setChangedFlag('ipProtocol');
            this.ipProtocol = ipProtocol;
        }
    },

    /**
     * @return {List.<EC2CidrIpRange>}
     */
    getIpRanges: function() {
        return this.ipRanges;
    },

    /**
     * @return {?number}
     */
    getToPort: function() {
        return this.toPort;
    },

    /**
     * @param {number} toPort
     */
    setToPort: function(toPort) {
        if (this.toPort !== toPort) {
            this.setChangedFlag('toPort');
            this.toPort = toPort;
        }
    },

    /**
     * @param {List.<EC2UserIdGroupPair>}
     */
    getUserIdGroupPairs: function() {
        return this.userIdGroupPairs;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {EC2CidrIpRange} ec2CidrIpRange
     */
    addCidrIpRange: function(ec2CidrIpRange) {
        this.ipRanges.add(ec2CidrIpRange);
    },

    /**
     * @param {EC2UserIdGroupPair} ec2UserIdGroupPair
     */
    addUserIdGroupPair: function(ec2UserIdGroupPair) {
        this.userIdGroupPairs.add(ec2UserIdGroupPair);
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param  {{
     *  fromPort: ?number,
     *  ipProtocol: ?string,
     *  toPort: ?number
     * }} jsonObject
     */
    jsonCreate: function(jsonObject) {
        var _this = this;
        this.fromPort = jsonObject.fromPort;
        this.ipProtocol = jsonObject.ipProtocol;
        this.toPort = jsonObject.toPort;
        if (jsonObject.ipRanges) {
            jsonObject.ipRanges.forEach(function(cidrIpRange) {
                var ec2CidrIpRange = new EC2CidrIpRange();
                ec2CidrIpRange.jsonCreate(cidrIpRange);
                _this.addCidrIpRange(ec2CidrIpRange);
            });
        }
        if (jsonObject.userIdGroupPairs) {
            jsonObject.userIdGroupPairs.forEach(function(userIdGroupPair) {
                var ec2UserIdGroupPair = new EC2UserIdGroupPair();
                ec2UserIdGroupPair.jsonCreate(userIdGroupPair);
                _this.addUserIdGroupPair(ec2UserIdGroupPair);
            });
        }
    },

    /**
     * @protected
     * @param  {{
     *  fromPort: ?number,
     *  ipProtocol: ?string,
     *  toPort: ?number
     * }} jsonObject
     */
    jsonUpdate: function(jsonObject) {
        this.setFromPort(jsonObject.fromPort);
        this.setIpProtocol(jsonObject.ipProtocol);
        this.setToPort(jsonObject.toPort);
        //TODO BRN: Update the ipRanges
    },

    /**
     * @protected
     * @param {{
     *  FromPort: ?number,
     *  IpProtocol: ?string,
     *  ToPort: ?number
     * }} awsObject
     */
    syncUpdate: function(awsObject) {
        var _this = this;
        this.fromPort = awsObject.FromPort;
        this.ipProtocol = awsObject.IpProtocol;
        this.toPort = awsObject.ToPort;
        awsObject.IpRanges.forEach(function(cidrIpRange) {
            var ec2CidrIpRange = new EC2CidrIpRange();
            ec2CidrIpRange.syncUpdate(cidrIpRange);
            _this.addCidrIpRange(ec2CidrIpRange);
        });
        awsObject.UserIdGroupPairs.forEach(function(userIdGroupPair) {
            var ec2UserIdGroupPair = new EC2UserIdGroupPair();
            ec2UserIdGroupPair.syncUpdate(userIdGroupPair);
            _this.addUserIdGroupPair(ec2UserIdGroupPair);
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aws.EC2IpPermission', EC2IpPermission);
