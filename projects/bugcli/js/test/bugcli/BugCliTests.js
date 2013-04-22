//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Collection')
//@Require('Obj')
//@Require('annotate.Annotate')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Annotate =          bugpack.require('annotate.Annotate');
var BugCli =            bugpack.require('bugcli.BugCli');
var TestAnnotation =    bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var test = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 *
 */
var registerActionOptionAndRunTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.bugCli = new BugCli();
        this.argv = [
            "dummy",
            "dummy",
            "testAction",
            "--testOption",
            "optionparam",
            "actionParam"
        ];
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        var validateCalled = false;
        var executeCalled = false;
        this.bugCli.registerCliAction({
            name: 'testAction',
            flags: [
                'testAction'
            ],
            parameters: [
                {
                    name: "testActionParam"
                }
            ],
            executeMethod: function(cliBuild, cliAction, callback) {
                executeCalled = true;
                test.assertEqual(cliAction.getName(), "testAction",
                    "Assert that the cliAction is 'testAction'");
                callback();
            },
            validateMethod: function(cliBuild, cliAction, callback) {
                validateCalled = true;
                test.assertEqual(cliAction.getName(), "testAction",
                    "Assert that the cliAction is 'testAction'");
                callback();
            }
        });

        this.bugCli.registerCliOption({
            name: 'testOption',
            flags: [
                '--testOption'
            ],
            parameters: [
                {
                    name: "testOptionParam"
                }
            ]
        });

        this.bugCli.configure(function(error) {
            if (!error) {
                _this.bugCli.run(_this.argv, function(error) {
                    if (!error) {
                        test.assertTrue(validateCalled,
                            "Assert that validate was called");
                        test.assertTrue(executeCalled,
                            "Assert that execute was called");
                    } else {
                        test.error(error);
                    }
                })
            } else {
                test.error(error);
            }
        });
    }
};
annotate(registerActionOptionAndRunTest).with(
    test().name("Register CliAction and CliOption then configure and run")
);
