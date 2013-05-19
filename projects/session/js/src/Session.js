//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Package('session')

//@Export('Session')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('UuidGenerator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var TypeUtil        = bugpack.require('TypeUtil');
var UuidGenerator   = bugpack.require('UuidGenerator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Session = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(sessionObject) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.sessionUuid = null;

        if (sessionObject) {
            if (TypeUtil.isString(sessionObject.sessionUuid)) {
                this.sessionUuid = sessionObject.sessionUuid;
            }
        } else {
            this.sessionUuid = UuidGenerator.generateUuid();
        }
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @return {Session}
     */
    getSessionUuid: function() {
        return this.sessionUuid;
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('session.Session', Session);
