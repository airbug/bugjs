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

//@Export('carapace.FormControlGroupView')

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
    var FormControlGroupView = Class.extend(MustacheView, {

        _name: "carapace.FormControlGroupView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template: '<div id="{{id}}" class="control-group {{attributes.classes}}"> </div>',

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data    = this._super();
            data.id     = this.getId() || "form-control-group" + this.getCid();
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.FormControlGroupView", FormControlGroupView);
});
