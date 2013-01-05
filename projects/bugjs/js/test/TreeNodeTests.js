//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Annotate = require('../../lib/Annotate');
var TestAnnotation = require('../../lib/unit/TestAnnotation');
var TreeNode = require('../../lib/TreeNode');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var test = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 * This tests
 * 1) Instantiation of a new TreeNode
 * 2) That the "value" is the value passed in during instantiation
 * 3) That the parent of the node is null after instantiation
 * 4) That the childNodes is an empty List after instantiation
 */
var instantiateTreeNodeTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testValue = "testValue";
        this.treeNode = new TreeNode(this.testValue);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.treeNode.getValue(), this.testValue,
            "Assert TreeNode value was set correctly during instantiation");
        test.assertEqual(this.treeNode.getParentNode(), null,
            "Assert TreeNode parent was set correctly during instantiation");
        test.assertEqual(this.treeNode.getChildNodes().isEmpty(), true,
            "Assert TreeNode childNodes is empty after instantiation");
    }
};
annotate(instantiateTreeNodeTest).with(
    test().name("TreeNode instantiation test")
);
