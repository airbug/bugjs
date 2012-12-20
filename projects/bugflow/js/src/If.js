//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('If')

//@Require('Class')
//@Require('Flow')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Flow = bugpack.require('Flow');
var List = bugpack.require('List');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var If = Class.extend(Flow, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(ifMethod, successFlow) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Flow}
         */
        this.elseFlow = null;

        /**
         * @private
         * @type {number}
         */
        this.elseIfIndex = -1;

        /**
         * @private
         * @type {List<If>}
         */
        this.elseIfList = new List();

        /**
         * @private
         * @type {function(Flow)}
         */
        this.ifMethod = ifMethod;

        /**
         * @private
         * @type {Flow}
         */
        this.successFlow = successFlow;
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        this.execArgs = args;
        this.ifMethod.apply(null, ([this]).concat(args));
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} bool
     */
    assert: function(bool) {
        var _this = this;
        if (bool) {
            this.successFlow.execute(this.execArgs, function(error) {
                _this.complete(error, bool);
            });
        } else {
            this.nextElseFlow();
        }
    },

    /**
     * @param {function()} ifMethod
     * @param {Flow} successFlow
     * @return {?function(Flow)}
     */
    $elseIf: function(ifMethod, successFlow) {
        if (this.elseFlow) {
            throw new Error("IfFlow already has an ElseFlow");
        }
        var elseIfFlow = new If(ifMethod, successFlow);
        this.elseIfList.add(elseIfFlow);
        return this;
    },

    /**
     * @param {Flow} elseFlow
     */
    $else: function(elseFlow) {
        if (this.elseFlow) {
            throw new Error("IfFlow already has an ElseFlow");
        }
        this.elseFlow = elseFlow;
        return this;
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Error} error
     * @param {boolean} result
     */
    elseIfCallback: function(error, result) {
        if (!error) {
            if (result) {
                this.complete(null, true);
            } else {
                this.nextElseFlow();
            }
        } else {
            this.error(error);
        }
    },

    /**
     * @private
     */
    nextElseFlow: function() {
        var _this = this;
        if (this.elseIfList.getCount() > 0 && this.elseIfIndex < this.elseIfList.getCount()) {
            this.elseIfIndex++;
            var elseIfFlow = this.elseIfList.getAt(this.elseIfIndex);
            elseIfFlow.execute(this.execArgs, function(error, result) {
                _this.elseIfCallback(error, result);
            });
        } else if (this.elseFlow) {
            this.elseFlow.execute(this.execArgs, function(error) {
                _this.complete(error, false);
            });
        } else {
            this.complete(null, false);
        }
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(If);
