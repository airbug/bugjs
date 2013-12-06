//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('ace')

//@Export('AceExts')

//@Require('Class')
//@Require('Obj')
//@Require('aceexts.Chromevox')
//@Require('aceexts.ElasticTabstopsLite')
//@Require('aceexts.Emmet')
//@Require('aceexts.KeybindingMenu')
//@Require('aceexts.LanguageTools')
//@Require('aceexts.Modelist')
//@Require('aceexts.OldIe')
//@Require('aceexts.Searchbox')
//@Require('aceexts.SettingsMenu')
//@Require('aceexts.Spellcheck')
//@Require('aceexts.Split')
//@Require('aceexts.StaticHighlight')
//@Require('aceexts.Statusbar')
//@Require('aceexts.Textarea')
//@Require('aceexts.Themelist')
//@Require('aceexts.Whitespace')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var Chromevox               = bugpack.require('aceexts.Chromevox');
var ElasticTabstopsLite     = bugpack.require('aceexts.ElasticTabstopsLite');
var Emmet                   = bugpack.require('aceexts.Emmet');
var KeybindingMenu          = bugpack.require('aceexts.KeybindingMenu');
var LanguageTools           = bugpack.require('aceexts.LanguageTools');
var Modelist                = bugpack.require('aceexts.Modelist');
var OldIe                   = bugpack.require('aceexts.OldIe');
var Searchbox               = bugpack.require('aceexts.Searchbox');
var SettingsMenu            = bugpack.require('aceexts.SettingsMenu');
var Spellcheck              = bugpack.require('aceexts.Spellcheck');
var Split                   = bugpack.require('aceexts.Split');
var StaticHighlight         = bugpack.require('aceexts.StaticHighlight');
var Statusbar               = bugpack.require('aceexts.Statusbar');
var Textarea                = bugpack.require('aceexts.Textarea');
var Themelist               = bugpack.require('aceexts.Themelist');
var Whitespace              = bugpack.require('aceexts.Whitespace');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AceExts    = Class.extend(Obj, {

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
        this.chromevox              = Chromevox;

        this.elasticTabstopsLite    = ElasticTabstopsLite;

        this.emmet                  = Emmet;

        this.keybindingMenu         = KeybindingMenu;

        this.languageTools          = LanguageTools;

        this.modelist               = Modelist;

        this.oldIe                  = OldIe;

        this.searchbox              = Searchbox;

        this.settingsMenu           = SettingsMenu;

        this.spellcheck             = Spellcheck;

        this.split                  = Split;

        this.staticHighlight        = StaticHighlight;

        this.statusbar              = Statusbar;

        this.textarea               = Textarea;

        this.themelist              = Themelist;

        this.whitespace             = Whitespace;
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    loadAll: function(){
        console.log("loading all ace exts");
        for(var propertyName in this){
            if(this[propertyName] && this[propertyName].load){
                console.log("loading", propertyName);
                this[propertyName].load();
            }
        }
    }
});


//-------------------------------------------------------------------------------
// Private Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @type {AceExts}
 */
AceExts.instance = null;


//-------------------------------------------------------------------------------
// Public Static Methods
//-------------------------------------------------------------------------------

/**
 * @return {AceExts}
 */
AceExts.getInstance = function() {
    if (AceExts.instance === null) {
        AceExts.instance = new AceExts();
    }
    return AceExts.instance;
};

/**
 *
 */
AceExts.loadAll = function(){
    var aceExts = AceExts.getInstance();
    aceExts.loadAll();
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("ace.AceExts", AceExts);
