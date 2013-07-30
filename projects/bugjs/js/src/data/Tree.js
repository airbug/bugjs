//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Tree')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Obj =   bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Tree = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.rootNode = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {TreeNode}
     */
    getRootNode: function() {
        return this.rootNode;
    },

    /**
     * @param {TreeNode} rootNode
     */
    setRootNode: function(rootNode) {
        this.rootNode = rootNode;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Class methods
    //-------------------------------------------------------------------------------

    /**
     * Performs a top down depth walk of the tree.
     * @param {function()} func
     */
    walk: function(func) {
        var rootNode = this.getRootNode();
        if (rootNode) {
            this.walkRecursive(rootNode, func);
        }
    },


    //-------------------------------------------------------------------------------
    // Private Class methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {TreeNode} node
     * @param {function(*)} func
     */
    walkRecursive: function(node, func) {
        func(node.getValue());
        var _this = this;
        node.getChildNodes().forEach(function(childNode) {
            _this.walkRecursive(childNode, func);
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Tree', Tree);