//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('archbug')

//@Export('ArchBuild')

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();
var AWS = require('aws-sdk');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Map =       bugpack.require('Map');
var Obj =       bugpack.require('Obj');
var TypeUtil =  bugpack.require('TypeUtil');
var BugBoil =   bugpack.require('bugboil.BugBoil');
var BugFlow =   bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $foreachParallel =  BugBoil.$foreachParallel;
var $series =           BugFlow.$series;
var $task =             BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ArchBuild = Class.extend(Obj, {

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
         * @type {string}
         */
        this.archKey = null;

        /**
         * @private
         * @type {*}
         */
        this.awsConfig = null;

        /**
         * @private
         * @type {Map.<string, AWS.EC2>}
         */
        this.regionToEC2Map = new Map();

        /**
         * @private
         * @type {*}
         */
        this.securityGroups = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param blueprint
     * @param {function(Error)} callback
     */
    configure: function(blueprint, callback) {
        this.configureBuild(blueprint);
        this.configureAWS();
        callback();
    },

    /**
     *
     */
    execute: function(callback) {
        this.buildFromBluePrint(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {function(Error)} callback
     */
    buildFromBluePrint: function(callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.buildSecurityGroups(function(error) {
                    flow.complete(error);
                });
            })/*,
             $task(function(flow) {

             })*/
        ]).execute(function(error) {
                callback(error);
            });
    },


    // Configure
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    configureAWS: function() {
        AWS.config.update(this.awsConfig);
    },

    /**
     * @private
     * @param blueprint
     */
    configureBuild: function(blueprint) {
        if (blueprint.archKey) {
            this.archKey = blueprint.archKey;
        } else {
            throw new Error("archKey is required in blueprint");
        }

        if (blueprint.awsConfig) {
            this.awsConfig = blueprint.awsConfig;
        } else {
            throw new Error("awsConfig is required in blueprint");
        }

        if (blueprint.securityGroups) {
            if (TypeUtil.isArray(blueprint.securityGroups)) {
                blueprint.securityGroups.forEach(function(securityGroup) {
                    if (!securityGroup.name) {
                        throw new Error("'name' is required in a security group entry");
                    }
                    if (!securityGroup.region) {
                        throw new Error("'region' is required in a security group entry");
                    }
                });
                this.securityGroups = blueprint.securityGroups;
            } else {
                throw new Error("securityGroups must be an array or empty in the blueprint");
            }
        } else {
            this.securityGroups = [];
        }
    },

    /**
     * @private
     * @param {string} region
     * @return {AWS.EC2}
     */
    generateEC2: function(region) {
        var ec2 = this.regionToEC2Map.get(region);
        if (!ec2) {
            ec2 = new AWS.EC2({region: region});
            this.regionToEC2Map.put(region, ec2);
        }
        return ec2;
    },


    // Security Groups
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {function(Error)} callback
     */
    buildSecurityGroups: function(callback) {
        var _this = this;
        $foreachParallel(this.securityGroups, function(boil, securityGroup) {
            _this.buildSecurityGroup(securityGroup, function(error) {
                boil.bubble(error);
            });
        }).execute(callback);
    },

    /**
     * @private
     * @param securityGroup
     * @param {function(Error)} callback
     */
    buildSecurityGroup: function(securityGroup, callback) {
        var _this = this;
        var ec2SecurityGroup = null;
        var securityGroupName = _this.archKey + "-" + securityGroup.name;
        var securityGroupRegion = securityGroup.region;
        var securityGroupDescription = securityGroup.description;
        $series([
            $task(function(flow) {
                _this.getSecurityGroupByName(securityGroupName, securityGroupRegion, function(error, _ec2SecurityGroup) {
                    if (!error) {
                        ec2SecurityGroup = _ec2SecurityGroup;
                        flow.complete();
                    } else {
                        flow.error(error);
                    }
                });
            }),
            $task(function(flow) {
                if (ec2SecurityGroup) {
                    //_this.updateSecurityGroup
                } else {
                    _this.createSecurityGroup(securityGroupName, securityGroupDescription, securityGroupRegion, function(error, _ec2SecurityGroup) {
                        if (!error) {
                            ec2SecurityGroup = _ec2SecurityGroup;
                            flow.complete();
                        } else {
                            flow.error(error);
                        }
                    });
                }
            })
        ]).execute(function(error) {
                callback(error);
            });
    },

    /**
     * @private
     * @param {string} name
     * @param {string} description
     * @param {string} region
     * @param {function(Error, SecurityGroup} callback
     */
    createSecurityGroup: function(name, description, region, callback) {
        var ec2 = this.generateEC2(region);
        var params = {
            GroupName: name,
            Description: description
        };
        ec2.client.createSecurityGroup(params, function(error, data) {
            //TEST
            console.log("createSecurityGroup complete");
            console.log(error);
            console.log(data);

            if (!error) {

            } else {
                //TODO BRN: security group exists, can we update if the description is different?
            }
        });
    },

    /**
     * @private
     * @param {string} name
     * @param {string} region
     * @param {function(Error, SecurityGroup} callback
     */
    getSecurityGroupByName: function(name, region, callback) {
        var ec2 = this.generateEC2(region);
        var params = {
            GroupNames: [
                name
            ]
        };
        ec2.client.describeSecurityGroups(params, function(error, data) {
            //TEST
            console.log("describeSecurityGroups complete");
            console.log(error);
            console.log(data);

            if (!error) {
                var ec2SecurityGroup = null;
                for (var i = 0, size = data.SecurityGroups.length; i < size; i++) {
                    var _ec2SecurityGroup = data.SecurityGroups[i];
                    if (_ec2SecurityGroup.GroupName === name) {
                        ec2SecurityGroup = _ec2SecurityGroup;
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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('archbug.ArchBuild', ArchBuild);
