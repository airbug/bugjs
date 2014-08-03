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

//@Export('carapace.FormViewWithWrapper')

//@Require('Class')
//@Require('carapace.FormViewEvent')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var FormViewEvent   = bugpack.require('carapace.FormViewEvent');
    var MustacheView    = bugpack.require('carapace.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var FormViewWithWrapper = Class.extend(MustacheView, {

        _name: "carapace.FormViewWithWrapper",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div class="form-wrapper">' +
                '<form class="{{classes}}" id="{{id}}">' +
                '</form>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.$el.find('.submit-button').off();
            this.$el.find('form').off();
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            var _this = this;
            this.$el.find('form').on('submit', function(event) {
                _this.handleSubmit(event);
                event.preventDefault();
                event.stopPropagation();
                return false;
            });
            this.$el.find('.submit-button').on('click', function(event) {
                _this.handleSubmit(event);
                event.preventDefault();
                event.stopPropagation();
                return false;
            });
        },


        //-------------------------------------------------------------------------------
        // MustacheView Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data            = this._super();
            data.classes        = this.attributes.classes;
            data.id             = this.getId() || "form-" + this.cid;
            return data;
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {Object}
         */
        getFormData: function() {

            // TODO BRN: This won't work for multiple check boxes. Will need to improve this if we have a form with more than
            // one checkbox.

            var formData = {};
            var formInputs = this.$el.find("form").serializeArray();
            formInputs.forEach(function(formInput) {
                formData[formInput.name] = formInput.value;
            });
            return formData;
        },

        /**
         * @protected
         */
        submitForm: function() {
            var formData = this.getFormData();
            this.dispatchEvent(new FormViewEvent(FormViewEvent.EventType.SUBMIT, {
                formData: formData
            }));
        },


        //-------------------------------------------------------------------------------
        // View Event Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {jquery.Event} event
         */
        handleSubmit: function(event) {
            this.submitForm();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.FormViewWithWrapper", FormViewWithWrapper);
});
