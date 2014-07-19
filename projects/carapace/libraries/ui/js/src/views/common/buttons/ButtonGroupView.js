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

//@Export('carapace.ButtonGroupView')

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
    var ButtonGroupView = Class.extend(MustacheView, {

        _name: "carapace.ButtonGroupView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<div id="button-group-{{cid}}" class="btn-group {{classes}}">' +
            '</div>',


        //-------------------------------------------------------------------------------
        // MustacheView Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data = this._super();
            switch (this.getAttribute("align")) {
                case "right":
                    data.classes += " pull-right";
                    break;
            }

            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.ButtonGroupView", ButtonGroupView);
});