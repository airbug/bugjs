//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('ace')

//@Export('AceThemes')

//@Require('Class')
//@Require('Obj')
//@Require('acethemes.Ambiance')
//@Require('acethemes.Chaos')
//@Require('acethemes.Chrome')
//@Require('acethemes.Clouds')
//@Require('acethemes.CloudsMidnight')
//@Require('acethemes.Cobalt')
//@Require('acethemes.CrimsonEditor')
//@Require('acethemes.Dawn')
//@Require('acethemes.Dreamweaver')
//@Require('acethemes.Eclipse')
//@Require('acethemes.Github')
//@Require('acethemes.IdleFingers')
//@Require('acethemes.Kr')
//@Require('acethemes.Merbivore')
//@Require('acethemes.MerbivoreSoft')
//@Require('acethemes.MonoIndustrial')
//@Require('acethemes.Monokai')
//@Require('acethemes.PastelOnDark')
//@Require('acethemes.SolarizedDark')
//@Require('acethemes.SolarizedLight')
//@Require('acethemes.Terminal')
//@Require('acethemes.Textmate')
//@Require('acethemes.Tomorrow')
//@Require('acethemes.TomorrowNight')
//@Require('acethemes.TomorrowNightBlue')
//@Require('acethemes.TomorrowNightBright')
//@Require('acethemes.TomorrowNightEighties')
//@Require('acethemes.Twilight')
//@Require('acethemes.VibrantInk')
//@Require('acethemes.Xcode')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var Ambiance                = bugpack.require('acethemes.Ambiance');
var Chaos                   = bugpack.require('acethemes.Chaos');
var Chrome                  = bugpack.require('acethemes.Chrome');
var Clouds                  = bugpack.require('acethemes.Clouds');
var CloudsMidnight          = bugpack.require('acethemes.CloudsMidnight');
var Cobalt                  = bugpack.require('acethemes.Cobalt');
var CrimsonEditor           = bugpack.require('acethemes.CrimsonEditor');
var Dawn                    = bugpack.require('acethemes.Dawn');
var Dreamweaver             = bugpack.require('acethemes.Dreamweaver');
var Eclipse                 = bugpack.require('acethemes.Eclipse');
var Github                  = bugpack.require('acethemes.Github');
var IdleFingers             = bugpack.require('acethemes.IdleFingers');
var Kr                      = bugpack.require('acethemes.Kr');
var Merbivore               = bugpack.require('acethemes.Merbivore');
var MerbivoreSoft           = bugpack.require('acethemes.MerbivoreSoft');
var MonoIndustrial          = bugpack.require('acethemes.MonoIndustrial');
var Monokai                 = bugpack.require('acethemes.Monokai');
var PastelOnDark            = bugpack.require('acethemes.PastelOnDark');
var SolarizedDark           = bugpack.require('acethemes.SolarizedDark');
var SolarizedLight          = bugpack.require('acethemes.SolarizedLight');
var Terminal                = bugpack.require('acethemes.Terminal');
var Textmate                = bugpack.require('acethemes.Textmate');
var Tomorrow                = bugpack.require('acethemes.Tomorrow');
var TomorrowNight           = bugpack.require('acethemes.TomorrowNight');
var TomorrowNightBlue       = bugpack.require('acethemes.TomorrowNightBlue');
var TomorrowNightBright     = bugpack.require('acethemes.TomorrowNightBright');
var TomorrowNightEighties   = bugpack.require('acethemes.TomorrowNightEighties');
var Twilight                = bugpack.require('acethemes.Twilight');
var VibrantInk              = bugpack.require('acethemes.VibrantInk');
var Xcode                   = bugpack.require('acethemes.Xcode');


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
        this.ambiance                   = Ambiance;

        this.chaos                      = Chaos;

        this.chrome                     = Chrome;

        this.clouds                     = Clouds;

        this.cloudsMidnight             = CloudsMidnight;

        this.cobalt                     = Cobalt;

        this.crimsonEditor              = CrimsonEditor;

        this.dawn                       = Dawn;

        this.dreamweaver                = Dreamweaver;

        this.eclipse                    = Eclipse;

        this.github                     = Github;

        this.idleFingers                = IdleFingers;

        this.kr                         = Kr;

        this.merbivore                  = Merbivore;

        this.merbivoreSoft              = MerbivoreSoft;

        this.monoIndustrial             = MonoIndustrial;

        this.monokai                    = Monokai;

        this.pastel_on_dark             = PastelOnDark;

        this.solarized_dark             = SolarizedDark;

        this.solarized_light            = SolarizedLight;

        this.terminal                   = Terminal;

        this.textmate                   = Textmate;

        this.tomorrow                   = Tomorrow;

        this.tomorrowNight              = TomorrowNight;

        this.tomorrowNightBlue          = TomorrowNightBlue;

        this.tomorrowNightBright        = TomorrowNightBright;

        this.tomorrowNightEighties      = TomorrowNightEighties;

        this.twilight                   = Twilight;

        this.vibrantInk                 = VibrantInk;

        this.xcode                      = Xcode;
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    loadAll: function(){
        console.log("loading all ace themes");
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
