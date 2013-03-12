//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('aws')

//@Export('EC2SecurityGroup')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Obj =       bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EC2SecurityGroup = Class.extend(Obj, {

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
         * @type {boolean}
         */
        this.changed = false;

        /**
         * @private
         * @type {string}
         */
        this.description = params.description;

        /**
         * @private
         * @type {string}
         */
        this.groupId = null;

        /**
         * @private
         * @type {string}
         */
        this.groupName = params.groupName;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getDescription: function() {
        return this.description;
    },

    /**
     * @param {string} description
     */
    setDescription: function(description) {
        if (description !== description) {
            this.changed = true;
            this.description = description;
        }
    },

    /**
     * @return {string}
     */
    getGroupId: function() {
        return this.groupId;
    },

    /**
     * @return {string}
     */
    getGroupName: function() {
        return this.groupName;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isChanged: function() {
        return this.changed;
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {{
     *    Description: string,
     *    GroupId: string,
     *    GroupName: string
     * }} securityGroup
     */
    syncUpdate: function(securityGroup) {
        this.description = securityGroup.Description;
        this.groupId = securityGroup.GroupId;
        this.groupName = securityGroup.GroupName;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aws.EC2SecurityGroup', EC2SecurityGroup);
