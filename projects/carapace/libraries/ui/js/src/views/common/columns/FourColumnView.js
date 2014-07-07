//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.FourColumnView')

//@Require('Class')
//@Require('carapace.MultiColumnView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var MultiColumnView     = bugpack.require('carapace.MultiColumnView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MultiColumnView}
     */
    var FourColumnView = Class.extend(MultiColumnView, {

        _name: "carapace.FourColumnView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="four-column-{{cid}}" class="{{rowStyle}} column-fill 3column-container {{classes}}">' +
                '<div id="column1of4-{{cid}}" class="column-fill column1of4 leftrow {{leftColumnSpan}} {{leftHamburger}}"></div>' +
                '<div id="column2of4-{{cid}}" class="column-fill column2of4 {{centerLeftColumnSpan}}"></div>' +
                '<div id="column3of4-{{cid}}" class="column-fill column3of4 {{centerRightColumnSpan}} "></div>' +
                '<div id="column4of4-{{cid}}" class="column-fill column4of4 rightrow {{rightColumnSpan}} {{rightHamburger}}"></div>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getColumn1Of4Element: function() {
            return this.findElement("#column1of4-{{cid}}");
        },

        /**
         * @return {jQuery}
         */
        getColumn2Of4Element: function() {
            return this.findElement("#column2of4-{{cid}}");
        },

        /**
         * @return {jQuery}
         */
        getColumn3Of4Element: function() {
            return this.findElement("#column3of4-{{cid}}");
        },

        /**
         * @return {jQuery}
         */
        getColumn4Of4Element: function() {
            return this.findElement("#column4of4-{{cid}}");
        },


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data                    = this._super();
            data.id                     = this.getId() || "four-column-row-container-" + this.cid;
            data.leftColumnSpan         = "span3";
            data.centerLeftColumnSpan   = "span3";
            data.centerRightColumnSpan  = "span3";
            data.rightColumnSpan        = "span3";
            switch (this.attributes.configuration) {
                case FourColumnView.Configuration.HAMBURGER_LEFT:
                    data.leftHamburger      = "hamburger-panel-left hamburger-panel-hidden";
                    data.rightHamburger     = "";
                    data.leftColumnSpan         = "span3";
                    data.centerLeftColumnSpan   = "span4";
                    data.centerRightColumnSpan  = "span4";
                    data.rightColumnSpan        = "span4";
                    break;
                case FourColumnView.Configuration.HAMBURGER_RIGHT:
                    data.leftHamburger = "";
                    data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                    data.leftColumnSpan         = "span4";
                    data.centerLeftColumnSpan   = "span4";
                    data.centerRightColumnSpan  = "span4";
                    data.rightColumnSpan        = "span3";
                    break;
                case FourColumnView.Configuration.HAMBURGER_LEFT_AND_RIGHT:
                    data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                    data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                    data.leftColumnSpan         = "span3";
                    data.centerLeftColumnSpan   = "span6";
                    data.centerRightColumnSpan  = "span6";
                    data.rightColumnSpan        = "span3";
                    break;
                case FourColumnView.Configuration.THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT:
                    data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                    data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                    data.leftColumnSpan         = "span3";
                    data.centerLeftColumnSpan   = "span9";
                    data.centerRightColumnSpan  = "span3";
                    data.rightColumnSpan        = "span3";
                    break;
                case FourColumnView.Configuration.EXTRA_THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT:
                    data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                    data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                    data.leftColumnSpan         = "span3";
                    data.centerLeftColumnSpan   = "span10";
                    data.centerRightColumnSpan  = "span2";
                    data.rightColumnSpan        = "span3";
                    break;
                case FourColumnView.Configuration.ULTRA_THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT:
                    data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                    data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                    data.leftColumnSpan         = "span3";
                    data.centerLeftColumnSpan   = "span11";
                    data.centerRightColumnSpan  = "span1";
                    data.rightColumnSpan        = "span3";
                    break;
                case FourColumnView.Configuration.ULTRA_THIN_RIGHT_HAMBURGER_LEFT:
                    data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                    data.rightHamburger = "";
                    data.leftColumnSpan         = "span3";
                    data.centerLeftColumnSpan   = "span11";
                    data.centerRightColumnSpan  = "span3";
                    data.rightColumnSpan        = "span1";
                    break;
            }
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {number}
     */
    FourColumnView.Configuration = {
        DEFAULT: 1,
        HAMBURGER_LEFT: 2,
        HAMBURGER_RIGHT: 3,
        HAMBURGER_LEFT_AND_RIGHT: 4,
        THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT: 5,
        EXTRA_THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT: 6,
        ULTRA_THIN_RIGHT_HAMBURGER_LEFT_AND_RIGHT: 7,
        ULTRA_THIN_RIGHT_HAMBURGER_LEFT: 8
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.FourColumnView", FourColumnView);
});
