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

//@Export('carapace.ModalView')

//@Require('Class')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.ModalViewEvent')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var ButtonViewEvent     = bugpack.require('carapace.ButtonViewEvent');
    var ModalViewEvent      = bugpack.require('carapace.ModalViewEvent');
    var MustacheView        = bugpack.require('carapace.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var ModalView = Class.extend(MustacheView, {

        _name: "carapace.ModalView'",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="modal-{{cid}}" class="modal hide {{classes}}">' +
                '<div id="modal-header-{{cid}}" class="modal-header">' +
                    '<button id="modal-close-button-{{cid}}" type="button" class="close">×</button>' +
                '</div>' +
                '<div id="modal-body-{{cid}}" class="modal-body"></div>' +
                '<div id="modal-footer-{{cid}}" class="modal-footer"></div>' +
            '</div>',


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
             * @type {ModalView.ModalState|string}
             */
            this.modalState     = ModalView.ModalState.HIDDEN;

            var _this = this;

            this.hearModalCloseButtonClick = function(event) {
                _this.handleModalCloseButtonClick(event);
            };
            this.hearModalHidden = function(event) {
                _this.handleModalHidden(event);
            };
            this.hearModalHide = function(event) {
                _this.handleModalHide(event);
            };
            this.hearModalShow = function(event) {
                _this.handleModalShow(event);
            };
            this.hearModalShown = function(event) {
                _this.handleModalShown(event);
            };
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getModalCloseButtonElement: function() {
            return this.findElement("#modal-close-button-{{cid}}");
        },

        /**
         * @return {jQuery}
         */
        getModalElement: function() {
            return this.findElement("#modal-{{cid}}");
        },

        /**
         * @return {ModalView.ModalState|string}
         */
        getModalState: function() {
            return this.modalState;
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.getModalCloseButtonElement().off("click", this.hearModalCloseButtonClick);
            this.getModalElement().off("hidden", this.hearModalHidden);
            this.getModalElement().off("hide", this.hearModalHide);
            this.getModalElement().off("show", this.hearModalShow);
            this.getModalElement().off("shown", this.hearModalShown);
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            this.getModalCloseButtonElement().on("click", this.hearModalCloseButtonClick);
            this.getModalElement().on("hidden", this.hearModalHidden);
            this.getModalElement().on("hide", this.hearModalHide);
            this.getModalElement().on("show", this.hearModalShow);
            this.getModalElement().on("shown", this.hearModalShown);
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

        },


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data    = this._super();
            return data;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        hideModal: function() {
            this.getModalElement().modal("hide");
        },

        /**
         *
         */
        showModal: function() {
            this.getModalElement().modal("show");
        },

        /**
         *
         */
        toggleModal: function() {
            this.getModalElement().modal("toggle");
        },


        //-------------------------------------------------------------------------------
        // JQuery Event Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleModalCloseButtonClick: function(event) {
            this.hideModal();
        },

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleModalHidden: function(event) {
            this.modalState = ModalView.ModalState.HIDDEN;
            this.dispatchEvent(new ModalViewEvent(ModalViewEvent.EventType.HIDDEN));
        },

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleModalHide: function(event) {

        },

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleModalShow: function(event) {

        },

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleModalShown: function(event) {
            this.modalState = ModalView.ModalState.SHOWN;
            this.dispatchEvent(new ModalViewEvent(ModalViewEvent.EventType.SHOWN));
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    ModalView.ModalState = {
        HIDDEN: "ModalView:ModalState:Hidden",
        SHOWN: "ModalView:ModalState:Shown"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.ModalView", ModalView);
});
