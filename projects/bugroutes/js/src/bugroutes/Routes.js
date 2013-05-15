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
     * @param {?Array.<Route|Array.<Route>>=} routes
     * NOTE: This is both a class and instance method. If no routes are passed it, it will automatically use this.routes.
     **/
    enableAll: function(routes){
        var _this = this;
        var routes = routes || this.routes;
        routes.forEach(function(route){
            if(TypeUtil.isArray(route)){
                _this.enableAll(route);
            } else {
                route.enable();
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
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugroutes.Routes', Routes);
