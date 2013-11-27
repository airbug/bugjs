//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('ace')

//@Export('AceThemes')

//@Require('Class')
//@Require('Obj')
//@Require('acethemes.Twilight')
//@Require('acethemes.TextMate')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var twilight    = bugpack.require('acethemes.Twilight');
var textMate    = bugpack.require("acethemes.TextMate");


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AceThemes    = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @type {{load: function()}}
         */
        this.textMate   = textMate;

        /**
         * @type {{load: function()}}
         */
        this.twilight   = twilight;
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    loadAll: function(){
        //TODO
        this.textMate.load();
        this.twilight.load();
    }
});


//-------------------------------------------------------------------------------
// Private Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @type {AceThemes}
 */
AceThemes.instance = null;


//-------------------------------------------------------------------------------
// Public Static Methods
//-------------------------------------------------------------------------------

/**
 * @return {AceThemes}
 */
AceThemes.getInstance = function() {
    if (AceThemes.instance === null) {
        AceThemes.instance = new AceThemes();
    }
    return AceThemes.instance;
};

/**
 *
 */
AceThemes.loadAll = function(){
    var aceThemes = AceThemes.getInstance();
    aceThemes.loadAll();
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("ace.AceThemes", AceThemes);
