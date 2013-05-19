//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('express')

//@Export('ExpressServer')

//@Require('Class')
//@Require('Obj')
//@Require('Proxy')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();
var http    = require('http');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');
var Proxy   = bugpack.require('Proxy');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ExpressServer = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(expressApp) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ExpressApp}
         */
        this.expressApp = expressApp;

        /**
         * @private
         * @type {http.Server}
         */
        this.httpServer = http.createServer(this.expressApp.getApp());

        Proxy.proxy(this, this.httpServer, [
            "listen"
        ]);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {http.Server}
     */
    getHttpServer: function() {
        return this.httpServer;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)} callback
     */
    initialize: function(callback){
        this.start(callback)
    },

    /**
     * @param callback
     */
    start: function(callback) {
        this.httpServer.listen(this.expressApp.get('port'), callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('express.ExpressServer', ExpressServer);
