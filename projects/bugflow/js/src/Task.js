//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('Task')

//@Require('Class')
//@Require('Flow')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Flow = bugpack.require('Flow');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

//NOTE BRN: An instance of this class is designed to be used only once.

var Task = Class.extend(Flow, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(taskMethod) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.taskMethod = taskMethod;
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        this.taskMethod.apply(null, ([this]).concat(args));
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(Task);
