//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmarsh')

//@Export('Marshaller')

//@Require('Class')
//@Require('LiteralUtil')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('class');
var LiteralUtil     = bugpack.require('LiteralUtil');
var Obj             = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Marshaller = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Marshaller.Format} format
     */
    _constructor: function(format) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Marshaller.Format}
         */
        this.format = format;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Marshaller.Format}
     */
    getFormat: function() {
        return this.format;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {(Array | Object | string)}
     */
    marshal: function(value) {
        var literal = this.convertToLiteral(value);
        var output = undefined;
        switch (this.format) {
            case Marshaller.Format.JSON:
                output = JSON.stringify(literal);
                break;
            case Marshaller.Format.LITERAL:
                output = literal;
                break;
            case Marshaller.Format.XML:
                //TODO BRN:
                break;
        }
        return output;
    },

    /**
     * @param {(Array | Object | string)} value
     * @param {Class} _class
     */
    unmarshal: function(value, _class) {
        //TODO BRN:
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {*} value
     * @return {(Object | Array | string | number | boolean)}
     */
    convertToLiteral: function(value) {
        return LiteralUtil.convertToLiteral(value);
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
Marshaller.Format = {
    JSON: "Json",
    LITERAL: "Literal",
    XML: "Xml"
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugmarsh.Marshaller', Marshaller);
