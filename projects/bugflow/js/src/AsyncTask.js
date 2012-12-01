//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('AsyncTask')

//@Require('Class')
//@Require('Task')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('AsyncTask');

var Class = bugpack.require('Class');
var Task = bugpack.require('Task');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AsyncTask = Class.extend(Task, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(taskMethod, callback) {

        this._super(taskMethod, callback);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function()}
         */
        this.callback = callback;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    complete: function() {
        this.callback();
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(AsyncTask);
