//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('aws')

//@Export('IAMUser')

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

var IAMUser = Class.extend(AwsObject, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(params) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.arn;

        /**
         * @private
         * @type {Date}
         */
        this.createDate;

        /**
         * @private
         * @type {string}
         */
        this.path;

        /**
         * @private
         * @type {string}
         */
        this.userId;

        /**
         * @private
         * @type {string}
         */
        this.userName;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getArn: function() {
        return this.arn;
    },

    /**
     * @return {string}
     */
    getCreateDate: function() {
        return this.createDate;
    },

    /**
     * @return {string}
     */
    getPath: function() {
        return this.path;
    },

    /**
     * @return {string}
     */
    getUserId: function() {
        return this.userId;
    },

    /**
     * @return {string}
     */
    getUserName: function() {
        return this.userName;
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {{
     *    Arn: string,
     *    CreateDate: Date,
     *    Path: string,
     *    UserId: string,
     *    UserName: string
     * }} awsObject
     */
    syncUpdate: function(awsObject) {
        this.arn = awsObject.Arn;
        this.createDate = awsObject.CreateDate;
        this.path = awsObject.Path;
        this.userId = awsObject.UserId;
        this.userName = awsObject.UserName;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aws.IAMUser', IAMUser);
