//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmarsh.MarshRegistry')
//@Require('bugmeta.Annotation')
//@Require('bugmeta.BugMeta')
//@Require('bugmeta.MetaContext')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var MarshRegistry           = bugpack.require('bugmarsh.MarshRegistry');
    var Annotation              = bugpack.require('bugmeta.Annotation');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var MetaContext             = bugpack.require('bugmeta.MetaContext');
    var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
    var BugYarn                 = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var bugyarn                 = BugYarn.context();
    var test                    = TestAnnotation.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestMarshRegistry", function(yarn) {
        yarn.wind({
            marshRegistry: new MarshRegistry()
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var marshRegistryInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testMarshRegistry = new MarshRegistry();
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testMarshRegistry, MarshRegistry),
                "Assert testMarshRegistry is an instance of MarshRegistry");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(marshRegistryInstantiationTest).with(
        test().name("MarshRegistry - instantiation test")
    );
});
