/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('express.ExpressApp')

//@Require('Class')
//@Require('Obj')
//@Require('Proxy')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var express     = require('express');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var Proxy       = bugpack.require('Proxy');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ExpressApp = Class.extend(Obj, {

        _name: "express.ExpressApp",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {*} express
         */
        _constructor: function(express) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {*}
             */
            this.app        = express();

            /**
             * @private
             * @type {Express}
             */
            this.express    = express;

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
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
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
});
