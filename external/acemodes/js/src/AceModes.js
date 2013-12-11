//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('ace')

//@Export('AceModes')

//@Require('Class')
//@Require('Obj')
//@Require('acemodes.Abap')
//@Require('acemodes.Actionscript')
//@Require('acemodes.Ada')
//@Require('acemodes.Asciidoc')
//@Require('acemodes.AssemblyX86')
//@Require('acemodes.Autohotkey')
//@Require('acemodes.Batchfile')
//@Require('acemodes.C9search')
//@Require('acemodes.CCpp')
//@Require('acemodes.Clojure')
//@Require('acemodes.Cobol')
//@Require('acemodes.Coffee')
//@Require('acemodes.Coldfusion')
//@Require('acemodes.Csharp')
//@Require('acemodes.Css')
//@Require('acemodes.Curly')
//@Require('acemodes.D')
//@Require('acemodes.Dart')
//@Require('acemodes.Diff')
//@Require('acemodes.Django')
//@Require('acemodes.Dot')
//@Require('acemodes.Ejs')
//@Require('acemodes.Erlang')
//@Require('acemodes.Forth')
//@Require('acemodes.Ftl')
//@Require('acemodes.Glsl')
//@Require('acemodes.Golang')
//@Require('acemodes.Groovy')
//@Require('acemodes.Haml')
//@Require('acemodes.Haskell')
//@Require('acemodes.Haxe')
//@Require('acemodes.Html')
//@Require('acemodes.HtmlCompletions')
//@Require('acemodes.HtmlRuby')
//@Require('acemodes.Ini')
//@Require('acemodes.Jade')
//@Require('acemodes.Java')
//@Require('acemodes.Javascript')
//@Require('acemodes.Json')
//@Require('acemodes.Jsoniq')
//@Require('acemodes.Jsp')
//@Require('acemodes.Jsx')
//@Require('acemodes.Julia')
//@Require('acemodes.Latex')
//@Require('acemodes.Less')
//@Require('acemodes.Liquid')
//@Require('acemodes.Lisp')
//@Require('acemodes.Livescript')
//@Require('acemodes.Logiql')
//@Require('acemodes.Lsl')
//@Require('acemodes.Lua')
//@Require('acemodes.Luapage')
//@Require('acemodes.Lucene')
//@Require('acemodes.Makefile')
//@Require('acemodes.Markdown')
//@Require('acemodes.Matlab')
//@Require('acemodes.Mushcode')
//@Require('acemodes.MushcodeHighRules')
//@Require('acemodes.Mysql')
//@Require('acemodes.Nix')
//@Require('acemodes.Objectivec')
//@Require('acemodes.Ocaml')
//@Require('acemodes.Pascal')
//@Require('acemodes.Perl')
//@Require('acemodes.Pgsql')
//@Require('acemodes.Php')
//@Require('acemodes.PlainText')
//@Require('acemodes.Powershell')
//@Require('acemodes.Prolog')
//@Require('acemodes.Properties')
//@Require('acemodes.Protobuf')
//@Require('acemodes.Python')
//@Require('acemodes.R')
//@Require('acemodes.Rdoc')
//@Require('acemodes.Rhtml')
//@Require('acemodes.Ruby')
//@Require('acemodes.Rust')
//@Require('acemodes.Sass')
//@Require('acemodes.Scad')
//@Require('acemodes.Scala')
//@Require('acemodes.Scheme')
//@Require('acemodes.Scss')
//@Require('acemodes.Sh')
//@Require('acemodes.Snippets')
//@Require('acemodes.Sql')
//@Require('acemodes.Stylus')
//@Require('acemodes.Svg')
//@Require('acemodes.Tcl')
//@Require('acemodes.Tex')
//@Require('acemodes.Text')
//@Require('acemodes.Textile')
//@Require('acemodes.Toml')
//@Require('acemodes.Twig')
//@Require('acemodes.Typescript')
//@Require('acemodes.Vbscript')
//@Require('acemodes.Velocity')
//@Require('acemodes.Verilog')
//@Require('acemodes.Xml')
//@Require('acemodes.Xquery')
//@Require('acemodes.Yaml')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var Abap                = bugpack.require('acemodes.Abap');
var Actionscript        = bugpack.require('acemodes.Actionscript');
var Ada                 = bugpack.require('acemodes.Ada');
var Asciidoc            = bugpack.require('acemodes.Asciidoc');
var AssemblyX86         = bugpack.require('acemodes.AssemblyX86');
var Autohotkey          = bugpack.require('acemodes.Autohotkey');
var Batchfile           = bugpack.require('acemodes.Batchfile');
var C9search            = bugpack.require('acemodes.C9search');
var CCpp                = bugpack.require('acemodes.CCpp');
var Clojure             = bugpack.require('acemodes.Clojure');
var Cobol               = bugpack.require('acemodes.Cobol');
var Coffee              = bugpack.require('acemodes.Coffee');
var Coldfusion          = bugpack.require('acemodes.Coldfusion');
var Csharp              = bugpack.require('acemodes.Csharp');
var Css                 = bugpack.require('acemodes.Css');
var Curly               = bugpack.require('acemodes.Curly');
var D                   = bugpack.require('acemodes.D');
var Dart                = bugpack.require('acemodes.Dart');
var Diff                = bugpack.require('acemodes.Diff');
var Django              = bugpack.require('acemodes.Django');
var Dot                 = bugpack.require('acemodes.Dot');
var Ejs                 = bugpack.require('acemodes.Ejs');
var Erlang              = bugpack.require('acemodes.Erlang');
var Forth               = bugpack.require('acemodes.Forth');
var Ftl                 = bugpack.require('acemodes.Ftl');
var Glsl                = bugpack.require('acemodes.Glsl');
var Golang              = bugpack.require('acemodes.Golang');
var Groovy              = bugpack.require('acemodes.Groovy');
var Haml                = bugpack.require('acemodes.Haml');
var Haskell             = bugpack.require('acemodes.Haskell');
var Haxe                = bugpack.require('acemodes.Haxe');
var Html                = bugpack.require('acemodes.Html');
var HtmlCompletions     = bugpack.require('acemodes.HtmlCompletions');
var HtmlRuby            = bugpack.require('acemodes.HtmlRuby');
var Ini                 = bugpack.require('acemodes.Ini');
var Jade                = bugpack.require('acemodes.Jade');
var Java                = bugpack.require('acemodes.Java');
var Javascript          = bugpack.require('acemodes.Javascript');
var Json                = bugpack.require('acemodes.Json');
var Jsoniq              = bugpack.require('acemodes.Jsoniq');
var Jsp                 = bugpack.require('acemodes.Jsp');
var Jsx                 = bugpack.require('acemodes.Jsx');
var Julia               = bugpack.require('acemodes.Julia');
var Latex               = bugpack.require('acemodes.Latex');
var Less                = bugpack.require('acemodes.Less');
var Liquid              = bugpack.require('acemodes.Liquid');
var Lisp                = bugpack.require('acemodes.Lisp');
var Livescript          = bugpack.require('acemodes.Livescript');
var Logiql              = bugpack.require('acemodes.Logiql');
var Lsl                 = bugpack.require('acemodes.Lsl');
var Lua                 = bugpack.require('acemodes.Lua');
var Luapage             = bugpack.require('acemodes.Luapage');
var Lucene              = bugpack.require('acemodes.Lucene');
var Makefile            = bugpack.require('acemodes.Makefile');
var Markdown            = bugpack.require('acemodes.Markdown');
var Matlab              = bugpack.require('acemodes.Matlab');
var Mushcode            = bugpack.require('acemodes.Mushcode');
var MushcodeHighRules   = bugpack.require('acemodes.MushcodeHighRules');
var Mysql               = bugpack.require('acemodes.Mysql');
var Nix                 = bugpack.require('acemodes.Nix');
var Objectivec          = bugpack.require('acemodes.Objectivec');
var Ocaml               = bugpack.require('acemodes.Ocaml');
var Pascal              = bugpack.require('acemodes.Pascal');
var Perl                = bugpack.require('acemodes.Perl');
var Pgsql               = bugpack.require('acemodes.Pgsql');
var Php                 = bugpack.require('acemodes.Php');
var PlainText           = bugpack.require('acemodes.PlainText');
var Powershell          = bugpack.require('acemodes.Powershell');
var Prolog              = bugpack.require('acemodes.Prolog');
var Properties          = bugpack.require('acemodes.Properties');
var Protobuf            = bugpack.require('acemodes.Protobuf');
var Python              = bugpack.require('acemodes.Python');
var R                   = bugpack.require('acemodes.R');
var Rdoc                = bugpack.require('acemodes.Rdoc');
var Rhtml               = bugpack.require('acemodes.Rhtml');
var Ruby                = bugpack.require('acemodes.Ruby');
var Rust                = bugpack.require('acemodes.Rust');
var Sass                = bugpack.require('acemodes.Sass');
var Scad                = bugpack.require('acemodes.Scad');
var Scala               = bugpack.require('acemodes.Scala');
var Scheme              = bugpack.require('acemodes.Scheme');
var Scss                = bugpack.require('acemodes.Scss');
var Sh                  = bugpack.require('acemodes.Sh');
var Snippets            = bugpack.require('acemodes.Snippets');
var Sql                 = bugpack.require('acemodes.Sql');
var Stylus              = bugpack.require('acemodes.Stylus');
var Svg                 = bugpack.require('acemodes.Svg');
var Tcl                 = bugpack.require('acemodes.Tcl');
var Tex                 = bugpack.require('acemodes.Tex');
var Text                = bugpack.require('acemodes.Text');
var Textile             = bugpack.require('acemodes.Textile');
var Toml                = bugpack.require('acemodes.Toml');
var Twig                = bugpack.require('acemodes.Twig');
var Typescript          = bugpack.require('acemodes.Typescript');
var Vbscript            = bugpack.require('acemodes.Vbscript');
var Velocity            = bugpack.require('acemodes.Velocity');
var Verilog             = bugpack.require('acemodes.Verilog');
var Xml                 = bugpack.require('acemodes.Xml');
var Xquery              = bugpack.require('acemodes.Xquery');
var Yaml                = bugpack.require('acemodes.Yaml');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AceModes    = Class.extend(Obj, {

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
        this.abap               = Abap;

        this.actionscript       = Actionscript;

        this.ada                = Ada;

        this.asciidoc           = Asciidoc;

        this.assemblyX86        = AssemblyX86;

        this.autohotkey         = Autohotkey;

        this.batchfile          = Batchfile;

        this.c9search           = C9search;

        this.cCpp               = CCpp;

        this.clojure            = Clojure;

        this.cobol              = Cobol;

        this.coffee             = Coffee;

        this.coldfusion         = Coldfusion;

        this.csharp             = Csharp;

        this.css                = Css;

        this.curly              = Curly;

        this.d                  = D;

        this.dart               = Dart;

        this.diff               = Diff;

        this.django             = Django;

        this.dot                = Dot;

        this.ejs                = Ejs;

        this.erlang             = Erlang;

        this.forth              = Forth;

        this.ftl                = Ftl;

        this.glsl               = Glsl;

        this.golang             = Golang;

        this.groovy             = Groovy;

        this.haml               = Haml;

        this.haskell            = Haskell;

        this.haxe               = Haxe;

        this.html               = Html;

        this.htmlCompletions    = HtmlCompletions;

        this.htmlRuby           = HtmlRuby;

        this.ini                = Ini;

        this.jade               = Jade;

        this.java               = Java;

        this.javascript         = Javascript;

        this.json               = Json;

        this.jsoniq             = Jsoniq;

        this.jsp                = Jsp;

        this.jsx                = Jsx;

        this.julia              = Julia;

        this.latex              = Latex;

        this.less               = Less;

        this.liquid             = Liquid;

        this.lisp               = Lisp;

        this.livescript         = Livescript;

        this.logiql             = Logiql;

        this.lsl                = Lsl;

        this.lua                = Lua;

        this.luapage            = Luapage;

        this.lucene             = Lucene;

        this.makefile           = Makefile;

        this.markdown           = Markdown;

        this.matlab             = Matlab;

        this.mushcode           = Mushcode;

        this.mushcodeHighRules  = MushcodeHighRules;

        this.mysql              = Mysql;

        this.nix                = Nix;

        this.objectivec         = Objectivec;

        this.ocaml              = Ocaml;

        this.pascal             = Pascal;

        this.perl               = Perl;

        this.pgsql              = Pgsql;

        this.php                = Php;

        this.plainText          = PlainText;

        this.powershell         = Powershell;

        this.prolog             = Prolog;

        this.properties         = Properties;

        this.protobuf           = Protobuf;

        this.python             = Python;

        this.r                  = R;

        this.rdoc               = Rdoc;

        this.rhtml              = Rhtml;

        this.ruby               = Ruby;

        this.rust               = Rust;

        this.sass               = Sass;

        this.scad               = Scad;

        this.scala              = Scala;

        this.scheme             = Scheme;

        this.scss               = Scss;

        this.sh                 = Sh;

        this.snippets           = Snippets;

        this.sql                = Sql;

        this.stylus             = Stylus;

        this.svg                = Svg;

        this.tcl                = Tcl;

        this.tex                = Tex;

        this.text               = Text;

        this.textile            = Textile;

        this.toml               = Toml;

        this.twig               = Twig;

        this.typescript         = Typescript;

        this.vbscript           = Vbscript;

        this.velocity           = Velocity;

        this.verilog            = Verilog;

        this.xml                = Xml;

        this.xquery             = Xquery;

        this.yaml               = Yaml;
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    loadAll: function(){
        console.log("loading all ace modes");
        for(var propertyName in this){
            if(this[propertyName] && this[propertyName].load){
                console.log("loading", propertyName);
                console.log("module:", this[propertyName]);
                this[propertyName].load();
            }
        }
    },

    loadTopTen: function(){
        console.log("loading top ten ace modes");
        this.cCpp.load();
        this.csharp.load();
        this.css.load();
        this.html.load();
        this.java.load();
        this.javascript.load();
        this.objectivec.load();
        this.php.load();
        this.python.load();
        this.ruby.load();
    }
});


//-------------------------------------------------------------------------------
// Private Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @type {AceModes}
 */
AceModes.instance = null;


//-------------------------------------------------------------------------------
// Public Static Methods
//-------------------------------------------------------------------------------

/**
 * @return {AceModes}
 */
AceModes.getInstance = function() {
    if (AceModes.instance === null) {
        AceModes.instance = new AceModes();
    }
    return AceModes.instance;
};

/**
 *
 */
AceModes.loadAll = function() {
    var aceModes = AceModes.getInstance();
    aceModes.loadAll();
};

/**
 *
 */
AceModes.loadTopTen = function() {
    var aceModes = AceModes.getInstance();
    aceModes.loadTopTen();
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("ace.AceModes", AceModes);
