//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('aws')

//@Export('EC2Api')

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var AWS = require('aws-sdk');
var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Obj =               bugpack.require('Obj');
var Map =               bugpack.require('Map');
var TypeUtil =          bugpack.require('TypeUtil');
var AwsConfig =         bugpack.require('aws.AwsConfig');
var EC2SecurityGroup =  bugpack.require('aws.EC2SecurityGroup');
var BugFlow =           bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $if = BugFlow.$if;
var $series = BugFlow.$series;
var $task = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EC2Api = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(awsConfig, params) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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
     * @private
     * @param {EC2SecurityGroup} ec2SecurityGroup
     * @param {function(Error, SecurityGroup} callback
     */
    createSecurityGroup: function(ec2SecurityGroup, callback) {
        this.initialize();
        var params = {
            GroupName: ec2SecurityGroup.getGroupName(),
            Description: ec2SecurityGroup.getDescription()
        };
        this.ec2.client.createSecurityGroup(params, function(error, data) {
            if (!error) {
                ec2SecurityGroup.groupId = data.GroupId;
                callback(null, ec2SecurityGroup);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @private
     * @param {string} groupName
     * @param {function(Error, EC2SecurityGroup} callback
     */
    getSecurityGroupByName: function(groupName, callback) {
        this.initialize();
        var params = {
            GroupNames: [
                groupName
            ]
        };
        this.ec2.client.describeSecurityGroups(params, function(error, data) {
            if (!error) {
                var ec2SecurityGroup = null;
                for (var i = 0, size = data.SecurityGroups.length; i < size; i++) {
                    var _ec2SecurityGroup = data.SecurityGroups[i];
                    if (_ec2SecurityGroup.GroupName === groupName) {
                        ec2SecurityGroup = new EC2SecurityGroup({});
                        ec2SecurityGroup.syncUpdate(_ec2SecurityGroup);
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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aws.EC2Api', EC2Api);
