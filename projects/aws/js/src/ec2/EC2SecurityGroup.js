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

//@Export('aws.EC2SecurityGroup')

//@Require('Class')
//@Require('Set')
//@Require('aws.AwsObject')
//@Require('aws.EC2IpPermission')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Set                 = bugpack.require('Set');
    var AwsObject           = bugpack.require('aws.AwsObject');
    var EC2IpPermission     = bugpack.require('aws.EC2IpPermission');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {AwsObject}
     */
    var EC2SecurityGroup = Class.extend(AwsObject, {

        _name: "aws.EC2SecurityGroup",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
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

            /**
             * @private
             * @type {Set.<EC2IpPermission>}
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
         * @return {Set.<EC2IpPermission>}
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
});
