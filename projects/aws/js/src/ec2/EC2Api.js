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

//@Export('aws.EC2Api')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('aws.EC2SecurityGroup')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var AWS                 = require('aws-sdk');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var TypeUtil            = bugpack.require('TypeUtil');
    var EC2SecurityGroup    = bugpack.require('aws.EC2SecurityGroup');
    var BugFlow             = bugpack.require('bugflow.BugFlow');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $series             = BugFlow.$series;
    var $task               = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var EC2Api = Class.extend(Obj, {

        _name: "aws.EC2Api",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {AwsConfig} awsConfig
         * @param {} params
         */
        _constructor: function(awsConfig, params) {

            this._super();

            params = params || {};

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AwsConfig}
             */
            this.awsConfig = awsConfig;

            /**
             * @private
             * @type {AWS.EC2}
             */
            this.ec2 = null;

            /**
             * @private
             * @type {boolean}
             */
            this.initialized = false;

            /**
             * @private
             * @type {string}
             */
            this.region = params.region ? params.region : "us-east-1";
        },


        //-------------------------------------------------------------------------------
        // Public Class Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {EC2SecurityGroup} ec2SecurityGroup
         * @param {function(Error} callback
         */
        authorizeSecurityGroup: function(ec2SecurityGroup, callback) {
            var ec2IpPermissionsList = ec2SecurityGroup.getIpPermissions();
            if (!ec2IpPermissionsList.isEmpty()) {
                var ipPermissions = [];
                ec2IpPermissionsList.forEach(function(ec2IpPermission) {
                    var ipPermission = {};
                    if (TypeUtil.isNumber(ec2IpPermission.getFromPort())) {
                        ipPermission.FromPort = ec2IpPermission.getFromPort();
                    }
                    if (ec2IpPermission.getIpProtocol()) {
                        ipPermission.IpProtocol = ec2IpPermission.getIpProtocol();
                    }
                    if (TypeUtil.isNumber(ec2IpPermission.getToPort())) {
                        ipPermission.ToPort = ec2IpPermission.getToPort();
                    }
                    var ipRangeList = ec2IpPermission.getIpRanges();
                    if (!ipRangeList.isEmpty()) {
                        var ipRanges = [];
                        ipRangeList.forEach(function(ec2CidrIpRange) {
                            ipRanges.push({
                                CidrIp: ec2CidrIpRange.getCidrIp()
                            });
                        });
                        ipPermission.IpRanges = ipRanges;
                    }
                    var userIdGroupPairList = ec2IpPermission.getUserIdGroupPairs();
                    if (!userIdGroupPairList.isEmpty()) {
                        var userIdGroupPairs = [];
                        userIdGroupPairList.forEach(function(ec2UserIdGroupPair) {
                            var userIdGroupPair = {};
                            if (ec2UserIdGroupPair.getGroupId()) {
                                userIdGroupPair.GroupId = ec2UserIdGroupPair.getGroupId();
                            }
                            if (ec2UserIdGroupPair.getGroupName()) {
                                userIdGroupPair.GroupName = ec2UserIdGroupPair.getGroupName();
                            }
                            if (ec2UserIdGroupPair.getUserId()) {
                                userIdGroupPair.UserId = ec2UserIdGroupPair.getUserId();
                            }
                            userIdGroupPairs.push(userIdGroupPair);
                        });
                        ipPermission.UserIdGroupPairs = userIdGroupPairs;
                    }
                    ipPermissions.push(ipPermission);
                });

                var params = {
                    GroupName: ec2SecurityGroup.getGroupName(),
                    IpPermissions: ipPermissions
                };

                this._authorizeSecurityGroupIngress(params, function(error, data) {
                    if (!error) {
                        callback();
                    } else {
                        callback(error);
                    }
                });
            } else {
                callback();
            }
        },

        /**
         * @param {EC2SecurityGroup} ec2SecurityGroup
         * @param {function(Error, EC2SecurityGroup} callback
         */
        createSecurityGroup: function(ec2SecurityGroup, callback) {
            var _this = this;
            $series([
                $task(function(flow) {
                    var params = {
                        GroupName: ec2SecurityGroup.getGroupName(),
                        Description: ec2SecurityGroup.getDescription()
                    };
                    _this._createSecurityGroup(params, function(error, data) {
                        if (!error) {
                            ec2SecurityGroup.groupId = data.GroupId;
                            flow.complete();
                        } else {
                            flow.error(error);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.authorizeSecurityGroup(ec2SecurityGroup, function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    ec2SecurityGroup.clearChangedFlags();
                    flow.complete();
                })
            ]).execute(function(error) {
                if (!error) {
                    callback(null, ec2SecurityGroup);
                } else {
                    callback(error);
                }
            });
        },

        /**
         * @param {string} groupName
         * @param {function(Error, EC2SecurityGroup} callback
         */
        getSecurityGroupByName: function(groupName, callback) {
            var params = {
                GroupNames: [
                    groupName
                ]
            };
            this._describeSecurityGroups(params, function(error, data) {
                if (!error) {
                    var ec2SecurityGroup = null;
                    for (var i = 0, size = data.SecurityGroups.length; i < size; i++) {
                        var _ec2SecurityGroup = data.SecurityGroups[i];
                        if (_ec2SecurityGroup.GroupName === groupName) {
                            ec2SecurityGroup = new EC2SecurityGroup();
                            ec2SecurityGroup.syncCreate(_ec2SecurityGroup);
                            break;
                        }
                    }
                    callback(null, ec2SecurityGroup);
                } else {
                    if (error.code === "InvalidGroup.NotFound") {

                        //NOTE BRN: The security group does not exist. So we will simply create it in the next step.

                        callback();
                    } else {
                        callback(error);
                    }
                }
            });
        },

        /**
         * @param {EC2SecurityGroup} ec2SecurityGroup
         * @param {function(Error, SecurityGroup} callback
         */
        updateSecurityGroup: function(ec2SecurityGroup, callback) {
            var _this = this;
            $series([
                $task(function(flow) {
                    _this.authorizeSecurityGroup(ec2SecurityGroup, function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    ec2SecurityGroup.clearChangedFlags();
                    flow.complete();
                })
            ]).execute(function(error) {
                if (!error) {
                    callback(null, ec2SecurityGroup);
                } else {
                    callback(error);
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Private Class Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        initialize: function() {
            if (!this.initialized) {
                this.initialized = true;
                AWS.config.update(this.awsConfig.toAWSObject());
                this.ec2 = new AWS.EC2({region: this.region});
            }
        },


        // API Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {{
         *  GroupName: ?string,
         *  GroupId: ?string,
         *  IpPermissions: Array.<{
         *      IpProtocol: ?string,
         *      FromPort: ?number,
         *      ToPort: ?number,
         *      UserIdGroupPairs: Array.<{
         *          UserId: string,
         *          GroupName: string,
         *          GroupId: string
         *      }>,
         *      IpRanges: Array.<{
         *          CidrIp: string
         *      }>
         *  }>
         * }} params
         * @param {function(Error, Object)} callback
         */
        _authorizeSecurityGroupIngress: function(params, callback) {
            this.initialize();
            this.ec2.client.authorizeSecurityGroupIngress(params, callback);
        },

        /**
         * @private
         * @param {{
         *  GroupName: string,
         *  Description: string,
         *  VpcId: ?string
         * }} params
         * @param {function(Error, Object)} callback
         */
        _createSecurityGroup: function(params, callback) {
            this.initialize();
            this.ec2.client.createSecurityGroup(params, callback);
        },

        /**
         * @private
         * @param {{
         *  GroupNames: ?Array.<string>,
         *  GroupIds:   ?Array.<string>,
         *  Filters:    ?Array.<{Name: string, Values: Array.<string>}>
         * }} params
         * @param {function(Error, Object)} callback
         */
        _describeSecurityGroups: function(params, callback) {
            this.initialize();
            this.ec2.client.describeSecurityGroups(params, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('aws.EC2Api', EC2Api);
});
