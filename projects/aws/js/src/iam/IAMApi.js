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

//@Export('aws.IAMApi')

//@Require('Class')
//@Require('Obj')
//@Require('aws.IAMUser')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var AWS         = require('aws-sdk');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var IAMUser     = bugpack.require('aws.IAMUser');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var IAMApi = Class.extend(Obj, {

        _name: "aws.IAMApi",


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
             * @type {AWS.IAM}
             */
            this.iam = null;

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
         * @param {string} userName
         * @param {function(Error, IAMUser} callback
         */
        getUserByName: function(userName, callback) {
            var params = {
                UserName: [
                    userName
                ]
            };
            this._getUser(params, function(error, data) {
                if (!error) {
                    var iamUser = null;
                    for (var i = 0, size = data.SecurityGroups.length; i < size; i++) {
                        var _ec2SecurityGroup = data.SecurityGroups[i];
                        if (_ec2SecurityGroup.GroupName === groupName) {
                            ec2SecurityGroup = new EC2SecurityGroup({});
                            ec2SecurityGroup.syncCreate(_ec2SecurityGroup);
                            break;
                        }
                    }
                    callback(null, ec2SecurityGroup);
                } else {

                    //TODO BRN: Make sure this error code is correct
                    if (error.code === "InvalidUser.NotFound") {

                        //NOTE BRN: The security group does not exist. So we will simply create it in the next step.

                        callback();
                    } else {
                        callback(error);
                    }
                }
            });
        },

        /**
         * @param options
         * @param {function(Error, Object)} callback
         */
        listUsers: function(options, callback) {
            this._listUsers({}, function(error, results) {
                if (!error) {
                    //TEST
                    console.log("_listUsers complete");
                    console.log(error);
                    console.log(results);

                    //TODO BRN: Convert results in to actual IAMUser objects
                    callback(null, results);
                } else {
                    callback(error);
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        initialize: function() {
            if (!this.initialized) {
                this.initialized = true;
                AWS.config.update(this.awsConfig.toAWSObject());
                this.iam = new AWS.IAM({region: this.region});
            }
        },


        // API Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {{
         *  UserName: ?string,
         * }} params
         * @param {function(Error, Object)} callback
         */
        _getUser: function(params, callback) {
            this.initialize();
            this.iam.client.getUser(params, callback);
        },

        /**
         * @private
         * @param {{
         *  PathPrefix: ?string,
         *  Marker: ?string,
         *  MaxItems: ?number
         * }} params
         * @param {function(Error, Object)} callback
         */
        _listUsers: function(params, callback) {
            this.initialize();
            this.iam.client.listUsers(params, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('aws.IAMApi', IAMApi);
});
