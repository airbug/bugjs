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

//@Export('carapace.NavListItemView')

//@Require('Class')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.InteractiveView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var ButtonViewEvent     = bugpack.require('carapace.ButtonViewEvent');
    var InteractiveView     = bugpack.require('carapace.InteractiveView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {InteractiveView}
     */
    var NavListItemView = Class.extend(InteractiveView, {

        _name: "carapace.NavListItemView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template: '<li id="nav-list-item-{{cid}}" class="{{classes}}"></li>',


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getNavListItemElement: function() {
            return this.findElement("#nav-list-item-{{cid}}");
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
                case "active":
                    if (attributeValue) {
                        this.getNavListItemElement().addClass("active");
                    } else {
                        this.getNavListItemElement().removeClass("active");
                    }
                    break;
                case "disabled":
                    if (attributeValue) {
                        this.getNavListItemElement().addClass("disabled");
                    } else {
                        this.getNavListItemElement().removeClass("disabled");
                    }
                    break;
            }
        },


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data = this._super();
            if (this.getAttribute("active")) {
                data.classes += " active";
            }
            if (this.getAttribute("disabled")) {
                data.classes += " disabled";
            }
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.NavListItemView", NavListItemView);
});
