//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroutes')

//@Export('Routes')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var TypeUtil    = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Routes = Class.extend(Obj, {

    /*
     * @param {} routes
     **/
    _constructor: function(routes){

        this._super();

        /*
         * @type {Array.<Route>}
         **/
        this.routes =   routes || []; // Change to List if requirements grow
    },

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /*
     * @param {express.app | socketIo.socket} app
     **/
    enableAll: function(app){
        var routes = this.routes;
        routes.forEach(function(route){
            if(TypeUtil.isArray(route)){
                Routes.enableAll(route, app);
            } else {
                route.enable(app);
            }
        });
    },

    /*
     * @param {Route} route
     **/
    add: function(route){
        this.routes.push(route);
    },

    /*
     * @param {Route | Array.<Route>} routesArray
     **/
    addAll: function(routesArray){
        var _this = this;
        if(TypeUtil.isArray(routesArray)){
            this.routes.concat(routesArray);
        } else {
            var routes = Array.prototype.slice.call(arguments);
            _this.addAll(routes);
        }
    }
});

//-------------------------------------------------------------------------------
// Public Class Methods
//-------------------------------------------------------------------------------

/*
 * @param {Array.<Route> | Route} routes
 * @param {express.app | socketIo.socket} app
 **/
Routes.enableAll = function(routes, app){
    routes.forEach(function(route){
        if(TypeUtil.isArray(route)){
            Routes.enableAll(route, app);
        } else {
            route.enable(app);
        }
    });
},


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugroutes.Routes', Routes);
