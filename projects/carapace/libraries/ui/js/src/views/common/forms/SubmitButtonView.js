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

//@Export('carapace.SubmitButtonView')

//@Require('Class')
//@Require('carapace.ButtonView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var ButtonView  = bugpack.require('carapace.ButtonView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ButtonView}
     */
    var SubmitButtonView = Class.extend(ButtonView, {

        _name: "carapace.SubmitButtonView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="{{id}}-wrapper"class="button-wrapper {{classes}}">' +
                '<button id="{{id}}" type="submit" class="btn summit-button {{buttonClasses}}">{{buttonName}}</button>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var id              = this.getId() || "submit-button-" + this.getCid();
            var data            = this._super();
            data.id             = id;
            data.buttonName     = this.attributes.buttonName;
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.SubmitButtonView", SubmitButtonView);
});
