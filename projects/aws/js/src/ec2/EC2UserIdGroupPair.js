//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('aws')

//@Export('EC2UserIdGroupPair')

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

var EC2UserIdGroupPair = Class.extend(AwsObject, {

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
        this.groupId = undefined;

        /**
         * @private
         * @type {?string}
         */
        this.groupName = undefined;

        /**
         * @private
         * @type {?string}
         */
        this.userId = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {?string}
     */
    getGroupId: function() {
        return this.groupId;
    },

    /**
     * @return {?string}
     */
    getGroupName: function() {
        return this.groupName;
    },

    /**
     * @return {?string}
     */
    getUserId: function() {
        return this.userId;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, EC2UserIdGroupPair)) {
            return (
                value.getGroupId() === this.getGroupId() &&
                value.getGroupName() === this.getGroupName() &&
                value.getUserId() === this.getUserId()
            );
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[EC2UserIdGroupPair]" +
                Obj.hashCode(this.getGroupId()) +
                Obj.hashCode(this.getGroupName()) +
                Obj.hashCode(this.getUserId())
            );
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param  {{
     *  groupId: ?string,
     *  groupName: ?string,
     *  userId: ?string
     * }} jsonObject
     */
    jsonCreate: function(jsonObject) {
        if (TypeUtil.isString(jsonObject.groupId)) {
            this.groupId = jsonObject.groupId;
        } else {
            this.groupId = undefined;
        }
        if (TypeUtil.isString(jsonObject.groupName)) {
            this.groupName = jsonObject.groupName;
        } else {
            this.groupName = undefined;
        }
        if (TypeUtil.isString(jsonObject.userId)) {
            this.userId = jsonObject.userId;
        } else {
            this.userId = undefined;
        }
    },

    /**
     * @protected
     * @param  {{
     *  groupId: ?string,
     *  groupName: ?string,
     *  userId: ?string
     * }} jsonObject
     */
    jsonUpdate: function(jsonObject) {
        //TODO BRN: Anything to do here?
    },

    /**
     * @protected
     * @param {{
     *  GroupId: ?string,
     *  GroupName: ?string,
     *  UserId: ?string
     * }} ipPermission
     */
    syncCreate: function(awsObject) {
        if (TypeUtil.isString(awsObject.GroupId)) {
            this.groupId = awsObject.GroupId;
        } else {
            this.groupId = undefined;
        }
        if (TypeUtil.isString(awsObject.GroupName)) {
            this.groupName = awsObject.GroupName;
        } else {
            this.groupName = undefined;
        }
        if (TypeUtil.isString(awsObject.UserId)) {
            this.userId = awsObject.UserId;
        } else {
            this.userId = undefined;
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aws.EC2UserIdGroupPair', EC2UserIdGroupPair);
