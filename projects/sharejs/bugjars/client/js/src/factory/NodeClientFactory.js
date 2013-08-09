//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('sharejs:client')

//@Export('NodeClientFactory')

//@Require('Class')
//@Require('Obj')
//@Require('sharejs:client.IClientFactory')
//@Require('sharejs:client.ShareJsClient')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var IClientFactory  = bugpack.require('sharejs:client.IClientFactory');
var ShareJsClient   = bugpack.require('sharejs:client.ShareJsClient');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var NodeClientFactory = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(share) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {share}
         */
        this.share = share;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {ShareJsClient}
     */
    createClient: function() {
        return new ShareJsClient(this.share.client);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(NodeClientFactory, IClientFactory);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('sharejs:client.NodeClientFactory', NodeClientFactory);
