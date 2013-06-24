//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('cookies')

//@Export('CookieSigner')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();
var cookie_signature    = require('cookie-signature');


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CookieSigner = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {string=} secret
     */
    _constructor: function(secret) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.secret = secret ? secret : "";
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getSecret: function() {
        return this.secret;
    },

    /**
     * @param {string} secret
     */
    setSecret: function(secret) {
        this.secret = secret;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} value
     * @return {string}
     */
    sign: function (value) {
        return cookie_signature.sign(value, this.secret);
    },

    /**
     * @param {string} value
     * @return {string}
     */
    unsign: function(value) {
        return cookie_signature.unsign(value.slice(2), this.secret);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('cookies.CookieSigner', CookieSigner);
