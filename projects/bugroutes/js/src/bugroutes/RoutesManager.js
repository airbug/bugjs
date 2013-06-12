//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroutes')

//@Export('RoutesManager')

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

var RoutesManager = Class.extend(Obj, {

    /*
     * @param {express.app | socketIo.socket} app
     * @param {Array.<Route>} routes
     **/
    _constructor: function(app, routes){

        this._super();

        /*
         * @type {express.app | socketIo.socket} app
         **/
        this.app = app;

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
 * @param {express.app | socketIo.socket} app
 * @param {Array.<Route> | Route} routes
 **/
Routes.enableAll = function(app, routes){
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

bugpack.export('bugroutes.RoutesManager', RoutesManager);
