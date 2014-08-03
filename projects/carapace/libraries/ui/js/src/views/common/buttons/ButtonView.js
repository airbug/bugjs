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

//@Export('carapace.ButtonView')

//@Require('Class')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var ButtonViewEvent     = bugpack.require('carapace.ButtonViewEvent');
    var MustacheView        = bugpack.require('carapace.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var ButtonView = Class.extend(MustacheView, {

        _name: "carapace.ButtonView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="{{id}}-wrapper" class="button-wrapper {{classes}}">' +
                '<button id="button-{{cid}}" class="btn {{buttonClasses}}"></button>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getButtonElement: function() {
            return this.findElement("#button-{{cid}}");
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.getButtonElement().off();
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            var _this = this;
            this.getButtonElement().on('click', function(event) {
                _this.handleButtonClick(event);
            });
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
                        this.getButtonElement().addClass("active");
                    } else {
                        this.getButtonElement().removeClass("active");
                    }
                    break;
                case "disabled":
                    if (attributeValue) {
                        this.getButtonElement().addClass("disabled");
                    } else {
                        this.getButtonElement().removeClass("disabled");
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
            data.buttonClasses = this.getAttribute("buttonClasses") || "";
            switch (this.attributes.size) {
                case ButtonView.Size.LARGE:
                    data.buttonClasses += " btn-large";
                    break;
                case ButtonView.Size.SMALL:
                    data.buttonClasses += " btn-small";
                    break;
                case ButtonView.Size.MINI:
                    data.buttonClasses += " btn-mini";
                    break;
            }
            switch (this.attributes.type) {
                case "default":
                    break;
                case "primary":
                    data.buttonClasses += " btn-primary";
                    break;
                case "info":
                    data.buttonClasses += " btn-info";
                    break;
                case "success":
                    data.buttonClasses += " btn-success";
                    break;
                case "warning":
                    data.buttonClasses += " btn-warning";
                    break;
                case "danger":
                    data.buttonClasses += " btn-danger";
                    break;
                case "inverse":
                    data.buttonClasses += " btn-inverse";
                    break;
                case "link":
                    data.buttonClasses += " btn-link";
                    break;
            }
            if (this.getAttribute("active")) {
                data.buttonClasses += " active";
            }
            if (this.getAttribute("block")) {
                data.buttonClasses += " btn-block";
            }
            if (this.getAttribute("disabled")) {
                data.buttonClasses += " disabled";
            }

            switch (this.attributes.align) {
                case "right":
                    data.classes += "pull-right";
                    break;
            }

            return data;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        disableButton: function() {
            this.setAttribute("disabled", true);
        },

        /**
         *
         */
        enableButton: function() {
            this.setAttribute("disabled", false);
        },


        //-------------------------------------------------------------------------------
        // View Event Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleButtonClick: function(event) {
            event.preventDefault();
            if (!this.getAttribute("disabled")) {
                this.dispatchEvent(new ButtonViewEvent(ButtonViewEvent.EventType.CLICKED, {}));
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {number}
     */
    ButtonView.Size = {
        LARGE: 1,
        NORMAL: 2,
        SMALL: 3,
        MINI: 4
    };

    /**
     * @static
     * @enum {string}
     */
    ButtonView.Type = {
        DEFAULT:    "default",
        PRIMARY:    "primary",
        INFO:       "info",
        SUCCESS:    "sucess",
        WARNING:    "warning",
        DANGER:     "danger",
        INVERSE:    "inverse",
        LINK:       "link"
    };

    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.ButtonView", ButtonView);
});
