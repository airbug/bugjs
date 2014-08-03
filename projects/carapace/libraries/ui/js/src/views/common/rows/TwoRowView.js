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

//@Export('carapace.TwoRowView')

//@Require('Class')
//@Require('TypeUtil')
//@Require('carapace.MultiRowView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var TypeUtil        = bugpack.require('TypeUtil');
    var MultiRowView    = bugpack.require('carapace.MultiRowView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MultiRowView}
     */
    var TwoRowView = Class.extend(MultiRowView, {

        _name: "carapace.TwoRowView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="two-row-{{cid}}" class="{{columnStyle}} row-fill two-row {{classes}}">' +
                '<div id="row1of2-{{cid}}" class="row-fill row1of2 {{row1Classes}}"></div>' +
                '<div id="row2of2-{{cid}}" class="row-fill row2of2 {{row2Classes}} "></div>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getRow1Of2Element: function() {
            return this.findElement("#row1of2-{{cid}}");
        },

        /**
         * @return {jQuery}
         */
        getRow2Of2Element: function() {
            return this.findElement("#row2of2-{{cid}}");
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {string} attributeName
         * @param {*} attributeValue
         */
        renderAttribute: function(attributeName, attributeValue) {
            switch (attributeName) {
                case "configuration":
                    this.validateConfiguration(attributeValue, 2);
                    this.clearStackClasses(this.getRow1Of2Element());
                    this.clearStackClasses(this.getRow2Of2Element());
                    this.getRow1Of2Element().addClass("stack" + attributeValue[0]);
                    this.getRow2Of2Element().addClass("stack" + attributeValue[1]);
                    break;
            }
        },


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {Object}
         */
        generateTemplateData: function() {
            var data                = this._super();
            data.row1Classes = "";
            data.row2Classes = "";
            var configuration = this.getAttribute("configuration");
            this.validateConfiguration(configuration, 2);
            data.row1Classes += "stack" + configuration[0];
            data.row2Classes += "stack" + configuration[1];
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.TwoRowView", TwoRowView);
});
