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

//@Export('carapace.BoxWithHeaderAndFooterView')

//@Require('Class')
//@Require('carapace.BoxView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var BoxView     = bugpack.require('carapace.BoxView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {BoxView}
     */
    var BoxWithHeaderAndFooterView = Class.extend(BoxView, {

        _name: "carapace.BoxWithHeaderAndFooterView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="box-{{cid}}" class="box box-with-header box-with-footer {{classes}}">' +
                '<div id="box-header-{{cid}}" class="box-header">' +
                '</div>' +
                '<div id="box-body-{{cid}}" class="box-body">' +
                '</div>' +
                '<div id="box-footer-{{cid}}" class="box-footer">' +
                '</div>' +
            '</div>'
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.BoxWithHeaderAndFooterView", BoxWithHeaderAndFooterView);
});
