//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('annotate.Annotate')
//@Require('bugroutes.Routes')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Annotate            = bugpack.require('annotate.Annotate');
var Routes              = bugpack.require('bugroutes.Routes');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');

//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate            = Annotate.annotate;
var test                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var enableAllTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){

        this.routesArray = [
            {
                name: "routeOne",
                enabled: false,
                enable: function(){
                    this.enabled = true;
                }
            },
            {
                name: "routeTwo",
                enabled: false,
                enable: function(){
                    this.enabled = true;
                }
            },
            {
                name: "RouteThree",
                enabled: false,
                enable: function(){
                    this.enabled = true;
                }
            }
        ];

        this.routes = new Routes(this.routesArray);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){
        this.routes.enableAll();
        var areAllEnabled = this.routes.routes[0].enabled && this.routes.routes[1].enabled && this.routes.routes[2].enabled;

        test.assertEqual(areAllEnabled, true,
            "Asserts that all of the individual routes have been enabled.");
    }
};
annotate(enableAllTest).with(
    test().name("Routes #enableAll Test")
);

var enableAllNestedTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        this.routeOne = {
            name: "routeOne",
            enabled: false,
            enable: function(){
                this.enabled = true;
            }
        };
        this.routeTwo =  {
            name: "routeTwo",
            enabled: false,
            enable: function(){
                this.enabled = true;
            }
        };
        this.routeThree = {
            name: "RouteThree",
            enabled: false,
            enable: function(){
                this.enabled = true;
            }
        };
        this.routeFour = {
            name: "routeFour",
            enabled: false,
            enable: function(){
                this.enabled = true;
            }
        };
        this.routesArray = [
            [
                this.routeOne,
                this.routeTwo,
                this.routeThree
            ],
            this.routeFour
        ];

        this.routes = new Routes(this.routesArray);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){
        this.routes.enableAll();

        test.assertEqual(this.routeOne.enabled, true,
            "Asserts that routeOne has been enabled.");
        test.assertEqual(this.routeTwo.enabled, true,
            "Asserts that routeTwo has been enabled.");
        test.assertEqual(this.routeThree.enabled, true,
            "Asserts that routeThree has been enabled.");
        test.assertEqual(this.routeFour.enabled, true,
            "Asserts that routeFour has been enabled.");
    }
};
annotate(enableAllNestedTest).with(
    test().name("Routes #enableAll Test with Nested Routes")
);
