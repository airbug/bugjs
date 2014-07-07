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

//@Export('carapace.OverlayView')

//@Require('Class')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.MustacheView')
//@Require('carapace.OverlayViewEvent')


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
    var OverlayViewEvent    = bugpack.require('carapace.OverlayViewEvent');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var OverlayView = Class.extend(MustacheView, {

        _name: "carapace.OverlayView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="overlay-{{cid}}" class="{{overlayWrapperClasses}}">' +
                '<div id="overlay-background-{{cid}}" class="overlay-background">' +
                '</div>' +
                '<div id="overlay-body-{{cid}}" class="{{overlayClasses}}">' +
                '</div>' +
            '</div>',



        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getOverlayElement: function() {
            return this.findElement("#overlay-{{cid}}");
        },

        /**
         * @return {jQuery}
         */
        getOverlayBackgroundElement: function() {
            return this.findElement("#overlay-background-{{cid}}");
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.getOverlayBackgroundElement().off();
            $("body").off("keyup", this.handleKeyupEvent);
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            var _this = this;
            this.getOverlayBackgroundElement().on('click', function(event) {
                _this.handleBackgroundClick(event);
            });
            $("body").keyup(this, this.handleKeyupEvent);
        },


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data    = this._super();
            if (this.attributes.classes) {
                data.overlayWrapperClasses = this.attributes.classes + " overlay";
            } else {
                data.overlayWrapperClasses = "overlay";
            }
            data.overlayClasses = "overlay-body";
            switch (this.attributes.type) {
                case OverlayView.Type.APPLICATION:
                    data.overlayWrapperClasses += " application-overlay";
                    break;
                case OverlayView.Type.PAGE:
                    data.overlayWrapperClasses += " page-overlay";
                    break;
                case OverlayView.Type.PANEL:
                    data.overlayWrapperClasses += " panel-overlay";
                    break;
            }
            switch (this.attributes.size) {
                case OverlayView.Size.ONE_HALF:
                    data.overlayClasses += " one-half-overlay";
                    break;
                case OverlayView.Size.ONE_THIRD:
                    data.overlayClasses += " one-third-overlay";
                    break;
                case OverlayView.Size.FULLSCREEN:
                    data.overlayClasses += " fullscreen-overlay";
                    break;
            }
            return data;
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleKeyupEvent: function(event){
            var _this = event.data;
            if(event.keyCode === 27) {
                _this.handleEscapeKeyKeyUp(event);
            }
        },

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleBackgroundClick: function(event) {
            event.preventDefault();
            this.dispatchEvent(new OverlayViewEvent(OverlayViewEvent.EventType.CLOSE));
        },

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleEscapeKeyKeyUp: function(event) {
            event.preventDefault();
            this.dispatchEvent(new OverlayViewEvent(OverlayViewEvent.EventType.CLOSE));
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    OverlayView.Type = {
        APPLICATION: "application-overlay",
        PAGE: "page-overlay",
        PANEL: "panel-overlay"
    };

    /**
     * @static
     * @enum {string}
     */
    OverlayView.Size = {
        ONE_QUARTER: "one-quarter-overlay",
        ONE_THIRD:   "one-third-overlay",
        ONE_HALF:    "one-half-overlay",
        FULLSCREEN:  "fullscreen-overlay"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.OverlayView", OverlayView);
});
