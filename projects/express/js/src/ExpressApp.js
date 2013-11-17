//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('express')

//@Export('ExpressApp')

//@Require('Class')
//@Require('Obj')
//@Require('Proxy')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();
var express = require('express');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');
var Proxy   = bugpack.require('Proxy');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ExpressApp = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        this.app = express();

        Proxy.proxy(this, this.app, [
            "configure",
            "delete",
            "engine",
            "head",
            "get",
            "on",
            "post",
            "put",
            "set",
            "use"
        ]);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {express}
     */
    getApp: function() {
        return this.app;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    initialize: function(callback) {
        var _this = this;

        // Shut Down
        //-------------------------------------------------------------------------------

        // Graceful Shutdown
        process.on('SIGTERM', function () {
            console.log("Server Closing");
            _this.app.close();
        });

        this.on('close', function () {
            console.log("Server Closed");
        });
        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('express.ExpressApp', ExpressApp);
