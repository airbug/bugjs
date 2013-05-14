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

        Proxy.proxy(this, this.app, [
            "configure",
            "set",
            "use"
        ]);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('express.ExpressApp', ExpressApp);
