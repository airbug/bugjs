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

//@Export('carapace.LoaderView')

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
    var LoaderView = Class.extend(MustacheView, {

        _name: "carapace.LoaderView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="loader-{{cid}}" class="loader {{classes}}">' +
                '<img class="loader-image" src="{{{staticUrl}}}/img/loader.gif">' +
                '</img>' +
            '</div>',



        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data = this._super();
            switch (this.getAttribute("size")) {
                case LoaderView.Size.SMALL:
                    data.classes += "loader-small";
                    break;
                case LoaderView.Size.MEDIUM:
                    data.classes += "loader-medium";
                    break;
                case LoaderView.Size.LARGE:
                    data.classes += "loader-large";
                    break;
            }
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {number}
     */
    LoaderView.Size = {
        SMALL: 1,
        MEDIUM: 2,
        LARGE: 3
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.LoaderView", LoaderView);
});
