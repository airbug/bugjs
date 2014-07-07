//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.MustacheView')

//@Require('Class')
//@Require('LiteralUtil')
//@Require('carapace.CarapaceView')
//@Require('mustache.Mustache')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var LiteralUtil             = bugpack.require('LiteralUtil');
    var CarapaceView            = bugpack.require('carapace.CarapaceView');
    var Mustache                = bugpack.require('mustache.Mustache');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var AutowiredTag     = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag      = bugpack.require('bugioc.PropertyTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var autowired               = AutowiredTag.autowired;
    var property                = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @constructor
     * @extends {CarapaceView}
     */
    var MustacheView = Class.extend(CarapaceView, {

        _name: "carapace.MustacheView",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} options
         */
        _constructor: function(options) {

            this._super(options);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AirbugStaticConfig}
             */
            this.carapaceStaticConfig = null;
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @return {Element}
         */
        make: function() {
            var data = this.generateTemplateData();
            return $(Mustache.render(this.template, data));
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data            = {};
            data.model          = this.model ? LiteralUtil.convertToLiteral(this.model) : {};
            data.attributes     = this.attributes;
            data.cid            = this.getCid();
            data.id             = this.getId() || "input-" + this.getCid();
            data.classes        = this.getAttribute("classes") || "";
            data.staticUrl      = this.carapaceStaticConfig.getStaticUrl();
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MustacheView).with(
        autowired().properties([
            property("carapaceStaticConfig").ref("carapaceStaticConfig")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.MustacheView", MustacheView);
});
