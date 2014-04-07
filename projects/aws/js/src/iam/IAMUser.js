//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('aws.IAMUser')

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

var IAMUser = Class.extend(AwsObject, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(params) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {?string}
         */
        this.arn = undefined;

        /**
         * @private
         * @type {?Date}
         */
        this.createDate = undefined;

        /**
         * @private
         * @type {?string}
         */
        this.path = undefined;

        /**
         * @private
         * @type {?string}
         */
        this.userId = undefined;

        /**
         * @private
         * @type {?string}
         */
        this.userName = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {?string}
     */
    getArn: function() {
        return this.arn;
    },

    /**
     * @return {?string}
     */
    getCreateDate: function() {
        return this.createDate;
    },

    /**
     * @return {?string}
     */
    getPath: function() {
        return this.path;
    },

    /**
     * @return {?string}
     */
    getUserId: function() {
        return this.userId;
    },

    /**
     * @return {?string}
     */
    getUserName: function() {
        return this.userName;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, IAMUser)) {
            return (
                value.getUserName() === this.getUserName()
            );
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[IAMUser]" + Obj.hashCode(this.getUserName()));
        }
        return this._hashCode;
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
    syncCreate: function(awsObject) {
        if (TypeUtil.isString(awsObject.Arn)) {
            this.arn = awsObject.Arn;
        } else {
            this.arn = undefined;
        }
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
