//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugtrace')

//@Export('BugTrace')

//@Require('Class')
//@Require('Obj')
//@Require('Proxy')
//@Require('StringUtil')
//@Require('Tree')
//@Require('TreeNode')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =         bugpack.require('Class');
var Obj =           bugpack.require('Obj');
var Proxy =         bugpack.require('Proxy');
var StringUtil =    bugpack.require('StringUtil');
var Tree =          bugpack.require('Tree');
var TreeNode =      bugpack.require('TreeNode');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugTrace = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {TreeNode}
         */
        this.currentNode = BugTrace.rootNode;

        /**
         * @private
         * @type {string}
         */
        this.header = "Bug stack trace:";

        /**
         * @private
         * @type {TreeNode}
         */
        this.rootNode = new TreeNode("ROOT_NODE");

        /**
         * @private
         * @type {Stack}
         */
        this.traceTree = new Tree();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {TreeNode}
     */
    getCurrentNode: function() {
        return this.currentNode;
    },

    /**
     * @param {TreeNode} currentNode
     */
    setCurrentNode: function(currentNode) {
        this.currentNode = currentNode;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Error} error
     * @return {Error}
     */
    $error: function(error) {
        if (!error.bugTraced) {
            error.bugTraced = true;
            if (!error.stack) {
                error.stack = this.generateStackTrace();
            }
    
            var currentStack = error.stack.split("\n");
            var totalStack = [];
            totalStack.push(this.header);
            totalStack = totalStack.concat(currentStack.slice(1));
    
            var currentNode = this.currentNode;
            while (!Obj.equals(currentNode, this.rootNode)) {
                var trace = currentNode.getValue();
                var stackParts = trace.split("\n").slice(2);
                totalStack.push("-------- Async Break ---------");
                totalStack = totalStack.concat(stackParts);
                if (!currentNode.getParentNode()) {
                    console.log("Node with empty parent - " + totalStack.join("\n"));
                }
                currentNode = currentNode.getParentNode();
            }
    
            error.stack = totalStack.join("\n");
        }
        return error;
    },

    /**
     * @param {function(...)} callback
     * @return {function}
     */
    $trace: function(callback) {
        var _this = this;
        var stack = this.generateStackTrace();
        var newNode = this.addTraceNode(stack);

        if (callback.aCallback) {
            throw new Error("This callback has already been wrapped in a trace");
        }
        var newCallback = function() {
            newCallback.aCallback = true;
            var args = Array.prototype.slice.call(arguments);
            _this.currentNode = newNode;
            callback.apply(null, args);

            //NOTE BRN: If one async thread ends and a new one starts that we have not wrapped in our own trace callback
            //we do not want any new nodes that the thread creates to attach to the previous current node (since they
            //are unrelated). So, we reset the current node to the root node after the completion of every callback.

            _this.currentNode = _this.rootNode;
            _this.checkTraceNodeForRemoval(newNode);
        };
        return newCallback;
    },

    /**
     * @param {function(Error, ...)} callback
     * @return {function}
     */
    $traceWithError: function(callback) {
    
        var _this = this;
        var stack = this.generateStackTrace();
        var newNode = this.addTraceNode(stack);

        if (callback.aCallback) {
            throw new Error("This callback has already been wrapped in a trace");
        }

        var newCallback = function() {
            newCallback.aCallback = true;
            var args = Array.prototype.slice.call(arguments);
            var error = args[0];
    
            if (error) {
                args[0] = _this.$error(error);
            }
            _this.currentNode = newNode;
            callback.apply(null, args);
            _this.currentNode = _this.rootNode;
            _this.checkTraceNodeForRemoval(newNode);
        };
        return newCallback;
    },
    
    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initialize: function() {
        this.traceTree.setRootNode(this.rootNode);
        this.currentNode = this.rootNode;
    },

    /**
     * @private
     * @param stack
     * @return {*}
     */
    addTraceNode: function(stack) {
        var newNode = new TreeNode(stack);
        this.currentNode.addChildNode(newNode);
        return newNode;
    },

    /**
     * @private
     */
    checkTraceNodeForRemoval: function(node) {
        //console.log("check trace node - numberChildren:" + node.numberChildNodes() + " Obj.equals(node, this.rootNode):" + Obj.equals(node, this.rootNode) + " value:" + node.getValue());
        if (node.numberChildNodes() === 0 && !Obj.equals(node, this.rootNode)) {

            //console.log("removing trace node - value:" + node.getValue());
            if (node.removed) {
                throw new Error("Trying to remove the same node TWICE!");
            }
            var parentNode = node.getParentNode();
            parentNode.removeChildNode(node);
            node.removed = true;

            this.checkTraceNodeForRemoval(parentNode);
        }
    },

    /**
     * Open source code taken from http://www.eriwen.com/javascript/js-stack-trace/
     * @return {Array.<string>}
     */
    generateStackTrace: function() {
        var callstack = [];
        var isCallstackPopulated = false;
        var error = new Error();
        if (error.stack) { //Firefox & nodejs
            callstack = error.stack.split('\n');
            callstack.shift();
            isCallstackPopulated = true;
        } else if (window.opera && error.message) { //Opera
            var lines = error.message.split('\n');
            for (var i = 0, len = lines.length; i < len; i++) {
                if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
                    var entry = lines[i];
                    //Append next line also since it has the file info
                    if (lines[i+1]) {
                        entry += ' at ' + lines[i+1];
                        i++;
                    }
                    callstack.push(entry);
                }
            }
            //Remove call to printStackTrace()
            callstack.shift();
            isCallstackPopulated = true;
        }
        if (!isCallstackPopulated) { //IE and Safari
            callstack = this.generateStackFromCaller();
        }
        return callstack.join("\n");
    },

    /**
     * @private
     * @return {Array.<string>}
     */
    generateStackFromCaller: function() {
        var callstack = [];
        var currentFunction = arguments.callee.caller;
        while (currentFunction) {
            var fn = currentFunction.toString();
            var fname = fn.substring(0, fn.indexOf("{")) || 'anonymous';
            fname = StringUtil.trim(fname);
            callstack.push(fname);
            currentFunction = currentFunction.caller;
        }
        return callstack;
    }
});


//-------------------------------------------------------------------------------
// Private Static Variables
//-------------------------------------------------------------------------------

/**
 * @private
 * @type {BugTrace}
 */
BugTrace.instance = null;


//-------------------------------------------------------------------------------
// Private Static Methods
//-------------------------------------------------------------------------------

/**
 * @private
 * @return {BugTrace}
 */
BugTrace.getInstance = function() {
    if (BugTrace.instance === null) {
        BugTrace.instance = new BugTrace();
        BugTrace.instance.initialize();
    }
    return BugTrace.instance;
};

Proxy.proxy(BugTrace, BugTrace.getInstance, [
    "$error",
    "$trace",
    "$traceWithError"
]);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugtrace.BugTrace', BugTrace);
