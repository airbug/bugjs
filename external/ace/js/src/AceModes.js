//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('ace')

//@Export('AceModes')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var cCpp        = bugpack.require('acemodes.CCpp');
var cSharp      = bugpack.require('acemodes.CSharp');
var css         = bugpack.require('acemodes.Css');
var html        = bugpack.require('acemodes.Html');
var java        = bugpack.require('acemodes.Java');
var javascript  = bugpack.require('acemodes.Javascript');
var objectiveC  = bugpack.require('acemodes.ObjectiveC');
var php         = bugpack.require('acemodes.Php');
var python      = bugpack.require('acemodes.Python');
var ruby        = bugpack.require('acemodes.Ruby');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AceModes    = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     */
    _constructor: function() {
        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @type {{load: function()}}
         */
        this.c          = cCpp;

        this.cPlusPlus  = cCpp;

        this.cSharp     = cSharp;

        this.css        = css;

        this.html       = html;

        this.java       = java;

        this.javascript = javascript;

        this.objectiveC = objectiveC;

        this.php        = php;

        this.python     = python;

        this.ruby       = ruby;


    }

    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    loadAll: function(){
        for(key in this){
            var loader = this[key]["load"];
            if(loader) loader();
        }
    },

    loadTopTen: function(){
        this.c.load();
        this.cSharp.load();
        this.css.load();
        this.html.load();
        this.java.load();
        this.javascript.load();
        this.objectiveC.load();
        this.php.load();
        this.python.load();
        this.ruby.load();
    }
};

//-------------------------------------------------------------------------------
// Private Class Variables
//-------------------------------------------------------------------------------

/**
 * @private
 * @type {ace.AceModes}
 */
AceModes.instance = null;


//-------------------------------------------------------------------------------
// Private Class Methods
//-------------------------------------------------------------------------------

/**
 * @private
 * @return {BugTrace}
 */
AceModes.getInstance = function() {
    if (AceModes.instance === null) {
        AceModes.instance = new AceModes();
    }
    return AceModes.instance;
};

AceModes.loadAll = function(){
    var aceModes = AceModes.getInstance();
    aceModes.loadAll();
}

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("ace.AceModes", AceModes);
