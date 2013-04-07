//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('aws')

//@Export('EC2SecurityGroup')

//@Require('Class')
//@Require('Set')
//@Require('aws.AwsObject')
//@Require('aws.EC2IpPermission')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Set =              bugpack.require('Set');
var AwsObject =         bugpack.require('aws.AwsObject');
var EC2IpPermission =   bugpack.require('aws.EC2IpPermission');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EC2SecurityGroup = Class.extend(AwsObject, {

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
         * @type {?string}
         */
        this.description = undefined;

        /**
         * @private
         * @type {?string}
         */
        this.groupId = undefined;

        /**
         * @private
         * @type {?string}
         */
        this.groupName = undefined;

        //TODO BRN:Replace this with a Set
        /**
         * @private
         * @type {List.<EC2IpPermission>}
         */
        this.ipPermissions = new Set();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getDescription: function() {
        return this.description;
    },

    /**
     * @return {string}
     */
    getGroupId: function() {
        return this.groupId;
    },

    /**
     * @return {string}
     */
    getGroupName: function() {
        return this.groupName;
    },

    /**
     * @return {List.<EC2IpPermission>}
     */
    getIpPermissions: function() {
        return this.ipPermissions;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {EC2IpPermission} ec2IpPermission
     */
    addIpPermission: function(ec2IpPermission) {
        this.ipPermissions.add(ec2IpPermission);
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    jsonCreate: function(jsonSecurityGroup) {
        var _this = this;
        this.description = jsonSecurityGroup.description;
        this.groupName = jsonSecurityGroup.groupName;
        if (jsonSecurityGroup.ipPermissions) {
            jsonSecurityGroup.ipPermissions.forEach(function(ipPermission) {
                var ec2IpPermission = new EC2IpPermission();
                ec2IpPermission.jsonCreate(ipPermission);
                _this.addIpPermission(ec2IpPermission);
            });
        }
    },

    /**
     * @protected
     * @param jsonSecurityGroup
     */
    jsonUpdate: function(jsonSecurityGroup) {
        //TODO BRN: update ip permissions
    },

    /**
     * @protected
     * @param {{
     *  Description: string,
     *  GroupId: string,
     *  GroupName: string,
     *  IpPermissions: Array.<{
     *      FromPort: number,
     *      IpProtocol: string,
     *      ToPort: number
     *  }>
     * }} securityGroup
     */
    syncCreate: function(securityGroup) {
        var _this = this;
        this.description = securityGroup.Description;
        this.groupId = securityGroup.GroupId;
        this.groupName = securityGroup.GroupName;
        securityGroup.IpPermissions.forEach(function(ipPermission) {
            var ec2IpPermission = new EC2IpPermission();
            ec2IpPermission.syncCreate(ipPermission);
            _this.addIpPermission(ec2IpPermission);
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aws.EC2SecurityGroup', EC2SecurityGroup);
