/*
 * Copyright (c) 2014 carapace Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of carapace Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.NakedButtonView')

//@Require('Class')
//@Require('carapace.ButtonView')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var ButtonView      = bugpack.require('carapace.ButtonView');
    var ButtonViewEvent = bugpack.require('carapace.ButtonViewEvent');
    var MustacheView    = bugpack.require('carapace.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var NakedButtonView = Class.extend(MustacheView, {

        _name: "carapace.NakedButtonView",


        //-------------------------------------------------------------------------------
        // BugView Properties
        //-------------------------------------------------------------------------------

        config: {
            autoPreventDefault: true
        },

        template: '<button id="button-{{cid}}" class="btn {{buttonClasses}} {{classes}}"></button>',


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

            var _this = this;
            this.hearButtonClick = function(event) {
                _this.handleButtonClick(event);
            };
        },


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
        // CarapaceView Extensions
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.getButtonElement().off("click", this.hearButtonClick);
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            this.getButtonElement().on("click", this.hearButtonClick);
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
        // MustacheView Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data = this._super();
            data.buttonClasses = "";
            data.id = this.getId();
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
            switch (this.attributes.align) {
                case "right":
                    data.buttonClasses += " pull-right";
                    break;
            }
            switch (this.attributes.block) {
                case true:
                    data.buttonClasses += " btn-block";
                    break
            }
            switch (this.attributes.disabled) {
                case true:
                    data.buttonClasses += " disabled";
                    break
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
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleButtonClick: function(event) {
            if (this.config.autoPreventDefault) {
                event.preventDefault();
            }
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
    NakedButtonView.Size = {
        LARGE: 1,
        NORMAL: 2,
        SMALL: 3,
        MINI: 4
    };

    /**
     * @static
     * @enum {string}
     */
    NakedButtonView.Type = {
        DEFAULT:    "default",
        PRIMARY:    "primary",
        INFO:       "info",
        SUCCESS:    "success",
        WARNING:    "warning",
        DANGER:     "danger",
        INVERSE:    "inverse",
        LINK:       "link"
    };

    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.NakedButtonView", NakedButtonView);
});
