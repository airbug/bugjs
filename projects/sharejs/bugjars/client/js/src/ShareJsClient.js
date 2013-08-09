//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('sharejs:client')

//@Export('ShareJsClient')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ShareJsClient = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(shareJs, clientConfig) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ShareJsClientConfig}
         */
        this.clientConfig   = clientConfig;

        /**
         * @private
         * @type {Connection}
         */
        this.connection     = null;

        /**
         * @private
         * @type {share}
         */
        this.shareJs        = shareJs;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function()} callback
     */
    initialize: function(callback) {
        var Connection = this.shareJs.Connection;
        this.connection = new Connection(this.clientConfig.toObject());
        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('sharejs:client.ShareJsClient', ShareJsClient);
