//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.LabelView')

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
    var LabelView = Class.extend(MustacheView, {

        _name: "carapace.LabelView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template: '<label id="{{id}}" class="{{classes}}" for="{{for}}">{{text}}</label>',


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data                = this._super();
            data.id                 = this.getId() || "label-" + this.getCid();
            data.text               = this.attributes.text;
            data.for                = this.attributes.for;
            data.classes            = this.attributes.classes;
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.LabelView", LabelView);
});
