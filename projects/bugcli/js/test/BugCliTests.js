//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugcli.BugCli')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var BugCli              = bugpack.require('bugcli.BugCli');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestTag      = bugpack.require('bugunit.TestTag');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestTag.test;


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
            "optionParam",
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
                test.assertEqual(cliAction.getParameter("testActionParam"), "actionParam",
                    "Assert that the parameter 'testActionParam' is 'actionParam'");
                var testOption = cliBuild.getOption("testOption");
                test.assertEqual(testOption.getParameter("testOptionParam"), "optionParam",
                    "Assert that the parameter 'testOptionParam' is 'optionParam'");
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
bugmeta.tag(registerActionOptionAndRunTest).with(
    test().name("Register CliAction and CliOption then configure and run")
);


/**
 *
 */
var defaultActionOptionAndRunTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.bugCli = new BugCli();
        this.argv = [
            "dummy",
            "dummy",
            "--testOption",
            "optionParam",
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
            default: true,
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
                test.assertEqual(cliAction.getParameter("testActionParam"), "actionParam",
                    "Assert that the parameter 'testActionParam' is 'actionParam'");
                var testOption = cliBuild.getOption("testOption");
                test.assertEqual(testOption.getParameter("testOptionParam"), "optionParam",
                    "Assert that the parameter 'testOptionParam' is 'optionParam'");
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
bugmeta.tag(defaultActionOptionAndRunTest).with(
    test().name("Register a default CliAction and a CliOption then configure and run")
);
