//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ace.AceSnippets')

//@Require('Class')
//@Require('Obj')
//@Require('acesnippets.Abap')
//@Require('acesnippets.Actionscript')
//@Require('acesnippets.Ada')
//@Require('acesnippets.Asciidoc')
//@Require('acesnippets.AssemblyX86')
//@Require('acesnippets.Autohotkey')
//@Require('acesnippets.Batchfile')
//@Require('acesnippets.C9search')
//@Require('acesnippets.CCpp')
//@Require('acesnippets.Clojure')
//@Require('acesnippets.Cobol')
//@Require('acesnippets.Coffee')
//@Require('acesnippets.Coldfusion')
//@Require('acesnippets.Csharp')
//@Require('acesnippets.Css')
//@Require('acesnippets.Curly')
//@Require('acesnippets.D')
//@Require('acesnippets.Dart')
//@Require('acesnippets.Diff')
//@Require('acesnippets.Django')
//@Require('acesnippets.Dot')
//@Require('acesnippets.Ejs')
//@Require('acesnippets.Erlang')
//@Require('acesnippets.Forth')
//@Require('acesnippets.Ftl')
//@Require('acesnippets.Glsl')
//@Require('acesnippets.Golang')
//@Require('acesnippets.Groovy')
//@Require('acesnippets.Haml')
//@Require('acesnippets.Haskell')
//@Require('acesnippets.Haxe')
//@Require('acesnippets.Html')
//@Require('acesnippets.HtmlCompletions')
//@Require('acesnippets.HtmlRuby')
//@Require('acesnippets.Ini')
//@Require('acesnippets.Jade')
//@Require('acesnippets.Java')
//@Require('acesnippets.Javascript')
//@Require('acesnippets.Json')
//@Require('acesnippets.Jsoniq')
//@Require('acesnippets.Jsp')
//@Require('acesnippets.Jsx')
//@Require('acesnippets.Julia')
//@Require('acesnippets.Latex')
//@Require('acesnippets.Less')
//@Require('acesnippets.Liquid')
//@Require('acesnippets.Lisp')
//@Require('acesnippets.Livescript')
//@Require('acesnippets.Logiql')
//@Require('acesnippets.Lsl')
//@Require('acesnippets.Lua')
//@Require('acesnippets.Luapage')
//@Require('acesnippets.Lucene')
//@Require('acesnippets.Makefile')
//@Require('acesnippets.Markdown')
//@Require('acesnippets.Matlab')
//@Require('acesnippets.Mushcode')
//@Require('acesnippets.MushcodeHighRules')
//@Require('acesnippets.Mysql')
//@Require('acesnippets.Nix')
//@Require('acesnippets.Objectivec')
//@Require('acesnippets.Ocaml')
//@Require('acesnippets.Pascal')
//@Require('acesnippets.Perl')
//@Require('acesnippets.Pgsql')
//@Require('acesnippets.Php')
//@Require('acesnippets.PlainText')
//@Require('acesnippets.Powershell')
//@Require('acesnippets.Prolog')
//@Require('acesnippets.Properties')
//@Require('acesnippets.Protobuf')
//@Require('acesnippets.Python')
//@Require('acesnippets.R')
//@Require('acesnippets.Rdoc')
//@Require('acesnippets.Rhtml')
//@Require('acesnippets.Ruby')
//@Require('acesnippets.Rust')
//@Require('acesnippets.Sass')
//@Require('acesnippets.Scad')
//@Require('acesnippets.Scala')
//@Require('acesnippets.Scheme')
//@Require('acesnippets.Scss')
//@Require('acesnippets.Sh')
//@Require('acesnippets.Snippets')
//@Require('acesnippets.Sql')
//@Require('acesnippets.Stylus')
//@Require('acesnippets.Svg')
//@Require('acesnippets.Tcl')
//@Require('acesnippets.Tex')
//@Require('acesnippets.Text')
//@Require('acesnippets.Textile')
//@Require('acesnippets.Toml')
//@Require('acesnippets.Twig')
//@Require('acesnippets.Typescript')
//@Require('acesnippets.Vbscript')
//@Require('acesnippets.Velocity')
//@Require('acesnippets.Verilog')
//@Require('acesnippets.Xml')
//@Require('acesnippets.Xquery')
//@Require('acesnippets.Yaml')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var Abap                = bugpack.require('acesnippets.Abap');
var Actionscript        = bugpack.require('acesnippets.Actionscript');
var Ada                 = bugpack.require('acesnippets.Ada');
var Asciidoc            = bugpack.require('acesnippets.Asciidoc');
var AssemblyX86         = bugpack.require('acesnippets.AssemblyX86');
var Autohotkey          = bugpack.require('acesnippets.Autohotkey');
var Batchfile           = bugpack.require('acesnippets.Batchfile');
var C9search            = bugpack.require('acesnippets.C9search');
var CCpp                = bugpack.require('acesnippets.CCpp');
var Clojure             = bugpack.require('acesnippets.Clojure');
var Cobol               = bugpack.require('acesnippets.Cobol');
var Coffee              = bugpack.require('acesnippets.Coffee');
var Coldfusion          = bugpack.require('acesnippets.Coldfusion');
var Csharp              = bugpack.require('acesnippets.Csharp');
var Css                 = bugpack.require('acesnippets.Css');
var Curly               = bugpack.require('acesnippets.Curly');
var D                   = bugpack.require('acesnippets.D');
var Dart                = bugpack.require('acesnippets.Dart');
var Diff                = bugpack.require('acesnippets.Diff');
var Django              = bugpack.require('acesnippets.Django');
var Dot                 = bugpack.require('acesnippets.Dot');
var Ejs                 = bugpack.require('acesnippets.Ejs');
var Erlang              = bugpack.require('acesnippets.Erlang');
var Forth               = bugpack.require('acesnippets.Forth');
var Ftl                 = bugpack.require('acesnippets.Ftl');
var Glsl                = bugpack.require('acesnippets.Glsl');
var Golang              = bugpack.require('acesnippets.Golang');
var Groovy              = bugpack.require('acesnippets.Groovy');
var Haml                = bugpack.require('acesnippets.Haml');
var Haskell             = bugpack.require('acesnippets.Haskell');
var Haxe                = bugpack.require('acesnippets.Haxe');
var Html                = bugpack.require('acesnippets.Html');
var HtmlCompletions     = bugpack.require('acesnippets.HtmlCompletions');
var HtmlRuby            = bugpack.require('acesnippets.HtmlRuby');
var Ini                 = bugpack.require('acesnippets.Ini');
var Jade                = bugpack.require('acesnippets.Jade');
var Java                = bugpack.require('acesnippets.Java');
var Javascript          = bugpack.require('acesnippets.Javascript');
var Json                = bugpack.require('acesnippets.Json');
var Jsoniq              = bugpack.require('acesnippets.Jsoniq');
var Jsp                 = bugpack.require('acesnippets.Jsp');
var Jsx                 = bugpack.require('acesnippets.Jsx');
var Julia               = bugpack.require('acesnippets.Julia');
var Latex               = bugpack.require('acesnippets.Latex');
var Less                = bugpack.require('acesnippets.Less');
var Liquid              = bugpack.require('acesnippets.Liquid');
var Lisp                = bugpack.require('acesnippets.Lisp');
var Livescript          = bugpack.require('acesnippets.Livescript');
var Logiql              = bugpack.require('acesnippets.Logiql');
var Lsl                 = bugpack.require('acesnippets.Lsl');
var Lua                 = bugpack.require('acesnippets.Lua');
var Luapage             = bugpack.require('acesnippets.Luapage');
var Lucene              = bugpack.require('acesnippets.Lucene');
var Makefile            = bugpack.require('acesnippets.Makefile');
var Markdown            = bugpack.require('acesnippets.Markdown');
var Matlab              = bugpack.require('acesnippets.Matlab');
var Mushcode            = bugpack.require('acesnippets.Mushcode');
var MushcodeHighRules   = bugpack.require('acesnippets.MushcodeHighRules');
var Mysql               = bugpack.require('acesnippets.Mysql');
var Nix                 = bugpack.require('acesnippets.Nix');
var Objectivec          = bugpack.require('acesnippets.Objectivec');
var Ocaml               = bugpack.require('acesnippets.Ocaml');
var Pascal              = bugpack.require('acesnippets.Pascal');
var Perl                = bugpack.require('acesnippets.Perl');
var Pgsql               = bugpack.require('acesnippets.Pgsql');
var Php                 = bugpack.require('acesnippets.Php');
var PlainText           = bugpack.require('acesnippets.PlainText');
var Powershell          = bugpack.require('acesnippets.Powershell');
var Prolog              = bugpack.require('acesnippets.Prolog');
var Properties          = bugpack.require('acesnippets.Properties');
var Protobuf            = bugpack.require('acesnippets.Protobuf');
var Python              = bugpack.require('acesnippets.Python');
var R                   = bugpack.require('acesnippets.R');
var Rdoc                = bugpack.require('acesnippets.Rdoc');
var Rhtml               = bugpack.require('acesnippets.Rhtml');
var Ruby                = bugpack.require('acesnippets.Ruby');
var Rust                = bugpack.require('acesnippets.Rust');
var Sass                = bugpack.require('acesnippets.Sass');
var Scad                = bugpack.require('acesnippets.Scad');
var Scala               = bugpack.require('acesnippets.Scala');
var Scheme              = bugpack.require('acesnippets.Scheme');
var Scss                = bugpack.require('acesnippets.Scss');
var Sh                  = bugpack.require('acesnippets.Sh');
var Snippets            = bugpack.require('acesnippets.Snippets');
var Sql                 = bugpack.require('acesnippets.Sql');
var Stylus              = bugpack.require('acesnippets.Stylus');
var Svg                 = bugpack.require('acesnippets.Svg');
var Tcl                 = bugpack.require('acesnippets.Tcl');
var Tex                 = bugpack.require('acesnippets.Tex');
var Text                = bugpack.require('acesnippets.Text');
var Textile             = bugpack.require('acesnippets.Textile');
var Toml                = bugpack.require('acesnippets.Toml');
var Twig                = bugpack.require('acesnippets.Twig');
var Typescript          = bugpack.require('acesnippets.Typescript');
var Vbscript            = bugpack.require('acesnippets.Vbscript');
var Velocity            = bugpack.require('acesnippets.Velocity');
var Verilog             = bugpack.require('acesnippets.Verilog');
var Xml                 = bugpack.require('acesnippets.Xml');
var Xquery              = bugpack.require('acesnippets.Xquery');
var Yaml                = bugpack.require('acesnippets.Yaml');




//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AceSnippets    = Class.extend(Obj, {

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
    // Methods
    //-------------------------------------------------------------------------------

    loadAll: function(){
        console.log("loading all ace snippets");
        for(var propertyName in this){
            if(this[propertyName] && this[propertyName].load){
                console.log("loading", propertyName);
                this[propertyName].load();
            }
        }
    },

    loadTopTen: function(){
        this.c.load();
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
 * @type {AceSnippets}
 */
AceSnippets.instance = null;


//-------------------------------------------------------------------------------
// Public Static Methods
//-------------------------------------------------------------------------------

/**
 * @return {AceSnippets}
 */
AceSnippets.getInstance = function() {
    if (AceSnippets.instance === null) {
        AceSnippets.instance = new AceSnippets();
    }
    return AceSnippets.instance;
};

/**
 *
 */
AceSnippets.loadAll = function(){
    var aceSnippets = AceSnippets.getInstance();
    aceSnippets.loadAll();
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("ace.AceSnippets", AceSnippets);
