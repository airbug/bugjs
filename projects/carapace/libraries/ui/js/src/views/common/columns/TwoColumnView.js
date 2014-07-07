//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.TwoColumnView')

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
    var TwoColumnView = Class.extend(MultiColumnView, {

        _name: "carapace.TwoColumnView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="two-column-{{cid}}" class="{{rowStyle}} column-fill 2column-container {{classes}}">' +
                '<div id="column1of2-{{cid}}" class="column-fill leftrow column1of2 {{column1Classes}}"></div>' +
                '<div id="column2of2-{{cid}}" class="column-fill rightrow column2of2 {{column2Classes}} "></div>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data                = this._super();
            data.column1Classes = "";
            data.column2Classes = "";
            switch (this.getAttribute("configuration")) {
                case TwoColumnView.Configuration.HIDE_RIGHT:
                    data.column1Classes += "span12";
                    data.column2Classes += "span0";
                    break;
                case TwoColumnView.Configuration.HIDE_LEFT:
                    data.column1Classes += "span0";
                    data.column2Classes += "span12";
                    break;
                case TwoColumnView.Configuration.THIN_RIGHT:
                    data.column1Classes += "span8";
                    data.column2Classes += "span4";
                    break;
                case TwoColumnView.Configuration.THICK_RIGHT:
                    data.column1Classes += "span4";
                    data.column2Classes += "span8";
                    break;
                case TwoColumnView.Configuration.THICK_RIGHT_WITH_OFFSET_2:
                    data.column1Classes += "span2 offset2";
                    data.column2Classes += "span6";
                    break;
                case TwoColumnView.Configuration.THIN_RIGHT_SMALL:
                    data.column1Classes += "span9";
                    data.column2Classes += "span3";
                    break;
                case TwoColumnView.Configuration.THICK_RIGHT_SMALL:
                    data.column1Classes += "span3";
                    data.column2Classes += "span9";
                    break;
                case TwoColumnView.Configuration.EXTRA_THIN_RIGHT_SMALL:
                    data.column1Classes += "span10";
                    data.column2Classes += "span2";
                    break;
                case TwoColumnView.Configuration.EXTRA_THICK_RIGHT_SMALL:
                    data.column1Classes += "span2";
                    data.column2Classes += "span10";
                    break;
                case TwoColumnView.Configuration.HAMBURGER_LEFT:
                    data.column1Classes += "span3 hamburger-panel-left hamburger-panel-hidden";
                    data.column2Classes += "span12";
                    break;
                case TwoColumnView.Configuration.HAMBURGER_RIGHT:
                    data.column1Classes += "span12";
                    data.column2Classes += "span3 hamburger-panel-right hamburger-panel-hidden";
                    break;
                default:
                    data.column1Classes += "span6";
                    data.column2Classes += "span6";
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
    TwoColumnView.Configuration = {
        DEFAULT: 1,
        THIN_RIGHT: 2,
        THICK_RIGHT: 3,
        THIN_LEFT: 3,
        THICK_LEFT: 2,
        HAMBURGER_LEFT: 4,
        HAMBURGER_RIGHT: 5,
        THIN_RIGHT_SMALL: 6,
        THICK_RIGHT_SMALL: 7,
        THIN_LEFT_SMALL: 7,
        THICK_LEFT_SMALL: 6,
        EXTRA_THIN_RIGHT_SMALL: 8,
        EXTRA_THICK_RIGHT_SMALL: 9,
        EXTRA_THIN_LEFT_SMALL: 9,
        EXTRA_THICK_LEFT_SMALL: 8,
        HIDE_RIGHT: 10,
        HIDE_LEFT: 11,
        THICK_RIGHT_WITH_OFFSET_2: 12
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.TwoColumnView", TwoColumnView);
});
