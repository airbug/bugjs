//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('annotate.Annotate')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugroutes.ExpressRoute')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Annotate            = bugpack.require('annotate.Annotate');
var ExpressRoute         = bugpack.require('bugroutes.ExpressRoute');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');

//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var test = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var constructorTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        this.method     = "get";
        this.routeName  = "myExpressRoute";
        this.listener   = function(){
            
        };
        this.expressRoute = new ExpressRoute(this.method, this.routeName, this.listener);

    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){
        var method          = this.expressRoute.method;
        var name            = this.expressRoute.name;
        var listener        = this.expressRoute.listener;

        test.assertEqual(method, "get",
            "Asserts that the expressRoute's method property is assigned properly on construction");
        test.assertEqual(name, "myExpressRoute",
            "Asserts that the expressRoute's name property is assigned properly on construction");
        test.assertEqual(listener, this.listener,
            "Asserts that the expressRoute's listener function is assigned properly on construction");
    }
};
annotate(constructorTest).with(
    test().name("ExpressRoute ._constructor Test")
);

var enableTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        this.method     = "get";
        this.routeName  = "myExpressRoute";
        this.listener   = function(){
            
        };
        this.expressRoute    = new ExpressRoute(this.method, this.routeName, this.listener);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){
        var app          = {};
        app[this.method] = function(){
            this.called = true;
        };
        this.expressRoute.enable(app);

        test.assertEqual(app.called, true, 
            "Asserts that ExpressRoute #enable calls the socket #on function")
    }
};
annotate(enableTest).with(
    test().name("ExpressRoute #enable Test")
);
