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
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.app = express();
    },


    //-------------------------------------------------------------------------------
    // Proxied Methods
    //-------------------------------------------------------------------------------

    configure: function() {
        this.app.configure.apply(this.app, arguments);
    },

    engine: function() {
        this.app.engine.apply(this.app, arguments);
    },

    get: function() {
        return this.app.get.apply(this.app, arguments);
    },

    on: function() {
        this.app.on.apply(this.app, arguments);
    },

    set: function() {
        this.app.set.apply(this.app, arguments);
    },

    use: function() {
        this.app.use.apply(this.app, arguments);
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
