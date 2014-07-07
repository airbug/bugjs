//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.FauxTextFieldView')

//@Require('Class')
//@Require('TypeUtil')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var TypeUtil        = bugpack.require('TypeUtil');
    var MustacheView    = bugpack.require('carapace.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var FauxTextFieldView = Class.extend(MustacheView, {

        _name: "carapace.FauxTextFieldView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<input id="{{id}}" class="{{classes}}" type="text" value="{{value}}" readonly="readonly" >',


        //-------------------------------------------------------------------------------
        // MustacheView Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data        = this._super();
            data.id         = this.getId() || "faux-textfield-" + this.getCid();
            data.value      = this.attributes.value;
            data.classes    = this.attributes.classes ? "faux-textfield" + this.attributes.classes : "faux-textfield";
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.FauxTextFieldView", FauxTextFieldView);
});
