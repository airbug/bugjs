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

//@Export('aws.EC2CidrIpRange')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('aws.AwsObject')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

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

    /**
     * @class
     * @extends {AwsObject}
     */
    var EC2CidrIpRange = Class.extend(AwsObject, {

        _name: "aws.EC2CidrIpRange",


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
});
