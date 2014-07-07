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

//@Export('carapace.FauxTextAreaView')

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
    var FauxTextAreaView = Class.extend(MustacheView, {

        _name: "carapace.FauxTextAreaView",

        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<textarea id="{{id}}" class="{{classes}}" rows="{{rows}}" cols="{{columns}}" readonly="readonly">{{value}}</textarea>',


        //-------------------------------------------------------------------------------
        // MustacheView Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data = this._super();
            data.id = this.getId() || "faux-textarea-" + this.getCid();
            if (!TypeUtil.isNumber(data.attributes.rows)) {
                data.attributes.rows = 2;
            }
            data.columns    = this.attributes.columns;
            data.rows       = this.attributes.rows;
            data.value      = this.attributes.value;
            data.classes    = this.attributes.classes ? "faux-textarea" + this.attributes.classes : "faux-textarea";
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.FauxTextAreaView", FauxTextAreaView);
});
