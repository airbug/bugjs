//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('aws')

//@Export('EC2CidrIpRange')

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

var EC2CidrIpRange = Class.extend(AwsObject, {

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
        this.cidrIp = null;
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
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param  {{
     *  cidrIp: ?string
     * }} jsonObject
     */
    jsonCreate: function(jsonObject) {
        this.cidrIp = jsonObject.cidrIp;
    },

    /**
     * @protected
     * @param  {{
     *  cidrIp: ?string
     * }} jsonObject
     */
    jsonUpdate: function(jsonObject) {
        //TODO BRN: Anything to do here?
    },

    /**
     * @protected
     * @param {{
     *  CidrIp: ?string
     * }} ipPermission
     */
    syncUpdate: function(awsObject) {
        this.cidrIp = awsObject.CidrIp;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aws.EC2CidrIpRange', EC2CidrIpRange);
