//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.NakedSubmitButtonView')

//@Require('Class')
//@Require('carapace.NakedButtonView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var NakedButtonView     = bugpack.require('carapace.NakedButtonView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {NakedButtonView}
     */
    var NakedSubmitButtonView = Class.extend(NakedButtonView, {

        _name: "carapace.NakedSubmitButtonView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<button id="submit-button-{{cid}}" type="submit" class="btn summit-button {{buttonClasses}}">{{buttonName}}</button>',


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data            = this._super();
            data.id             = id;
            data.buttonName     = this.attributes.buttonName;
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.NakedSubmitButtonView", NakedSubmitButtonView);
});
