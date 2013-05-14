//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroutes')

//@Export('ExpressRoute')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ExpressRoute = Class.extend(Obj, {

    /*
     * @param {string} method
     * @param {string} name
     * @param {function(req, res)} listener
     **/
    _constructor: function(method, name, listener){

        this._super();

        //-------------------------------------------------------------------------------
        // Variables
        //-------------------------------------------------------------------------------

        /*
         * @type {function(req, res)}
         **/
        this.listener = listener;

        /*
         * @type {string}
         **/
        this.method = method;

        /*
         * @type {string}
         **/
        this.name = name;

    },

    /*
     * @param {express.app} app
     **/
    enable: function(app){
        app[this.method](this.name, this.listener);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugroutes.ExpressRoute', ExpressRoute);
