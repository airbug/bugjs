//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.FormWithSubmitButtonView')

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
     * @extends {fMustacheView}
     */
    var FormWithSubmitButtonView = Class.extend(MustacheView, {

        _name: "carapace.FormWithSubmitButtonView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div class="form-wrapper">' +
                '<form class="{{classes}}">' +
                    '<div class="control-group">' +
                    '<button id="submit-button-{{cid}}" type="submit" class="btn">{{name}}</button>' +
                    '</div>' +
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
            this.$el.find('#submit-button-' + this.getCid()).off();
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
            this.$el.find('#submit-button-' + this.getCid()).on('click', function(event) {
                _this.handleSubmit(event);
                event.preventDefault();
                event.stopPropagation();
                return false;
            });
        },


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data = this._super();
            data.name = this.attributes.name;
            data.classes = this.attributes.classes;
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

    bugpack.export('carapace.FormWithSubmitButtonView', FormWithSubmitButtonView);
});
