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

//@Export('carapace.ListItemView')

//@Require('Class')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var MustacheView    = bugpack.require('carapace.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var ListItemView = Class.extend(MustacheView, {

        _name: "carapace.ListItemView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template: '<div id="list-item-{{cid}}" class="list-item list-item-{{attributes.size}} {{classes}}">' +
                  '</div>',


        //-------------------------------------------------------------------------------
        // CarapaceView Extensions
        //-------------------------------------------------------------------------------

        attributes: {
            size: "small"
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getListItemElement: function() {
            return this.findElement("#list-item-{{cid}}");
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
                        this.getListItemElement().addClass("active");
                    } else {
                        this.getListItemElement().removeClass("active");
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
            var data            = this._super();
            var size            = this.getAttribute("size");
            switch (size) {
                case ListItemView.Size.FLEX:
                    data.classes += "list-item-flex";
                    break;
                case ListItemView.Size.LARGE:
                    data.classes += "list-item-large";
                    break;
                case ListItemView.Size.MICRO:
                    data.classes += "list-item-micro";
                    break;
                case ListItemView.Size.SMALL:
                    data.classes += "list-item-small";
                    break;
            }
            if (this.getAttribute("active")) {
                data.buttonClasses += " active";
            }
            return data;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        activateItem: function() {
            this.setAttribute("active", true);
        },

        /**
         *
         */
        deactivateItem: function() {
            this.setAttribute("active", false);
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    ListItemView.Size = {
        FLEX: "flex",
        LARGE: "large",
        MICRO: "micro",
        SMALL: "small"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.ListItemView", ListItemView);
});
