//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('aws')

//@Export('EC2UserIdGroupPair')

//@Require('Class')
//@Require('aws.AwsObject')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
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
        this.groupId = null;

        /**
         * @private
         * @type {?string}
         */
        this.groupName = null;

        /**
         * @private
         * @type {?string}
         */
        this.userId = null;
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
        this.groupId = jsonObject.groupId;
        this.groupName = jsonObject.groupName;
        this.userId = jsonObject.userId;
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
    syncUpdate: function(awsObject) {
        this.groupId = awsObject.GroupId;
        this.groupName = awsObject.GroupName;
        this.userId = awsObject.UserId;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aws.EC2UserIdGroupPair', EC2UserIdGroupPair);
