/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.ThreeColumnView')

//@Require('Class')
//@Require('carapace.MultiColumnView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var MultiColumnView     = bugpack.require('carapace.MultiColumnView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ThreeColumnView = Class.extend(MultiColumnView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template:       '<div id={{id}} class="{{rowStyle}} column-fill 3column-container">' +
                        '<div class="{{leftColumnSpan}}  {{leftHamburger}}  column-fill   column1of3"></div>' +
                        '<div class="{{centerColumnSpan}}                   column-fill   column2of3"></div>' +
                        '<div class="{{rightColumnSpan}} {{rightHamburger}} column-fill   column3of3"></div>' +
                    '</div>',


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "three-column-row-container-" + this.cid;
        data.leftColumnSpan = "span4";
        data.centerColumnSpan = "span4";
        data.rightColumnSpan = "span4";
        switch (this.attributes.configuration) {
            case ThreeColumnView.Configuration.HAMBURGER_LEFT:
                data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                data.leftColumnSpan = "span3";
                data.centerColumnSpan = "span6";
                data.rightColumnSpan = "span6";
                break;
            case ThreeColumnView.Configuration.HAMBURGER_RIGHT:
                data.leftHamburger = "";
                data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                data.leftColumnSpan = "span6";
                data.centerColumnSpan = "span6";
                data.rightColumnSpan = "span3";
                break;
            case ThreeColumnView.Configuration.HAMBURGER_LEFT_AND_RIGHT:
                data.leftHamburger = "hamburger-panel-left hamburger-panel-hidden";
                data.rightHamburger = "hamburger-panel-right hamburger-panel-hidden";
                data.leftColumnSpan = "span3";
                data.centerColumnSpan = "span12";
                data.rightColumnSpan = "span3";
                break;
            case ThreeColumnView.Configuration.CHAT_WIDGET_INPUT_CONTAINER:
                data.leftColumnSpan = "span9";
                data.centerColumnSpan = "span1";
                data.rightColumnSpan = "span2";
                break;
        }
        return data;
    }
});

/**
 * @enum {number}
 */
ThreeColumnView.Configuration = {
    DEFAULT: 1,
    HAMBURGER_LEFT: 2,
    HAMBURGER_RIGHT: 3,
    HAMBURGER_LEFT_AND_RIGHT: 4,
    CHAT_WIDGET_INPUT_CONTAINER: 5
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("carapace.ThreeColumnView", ThreeColumnView);
