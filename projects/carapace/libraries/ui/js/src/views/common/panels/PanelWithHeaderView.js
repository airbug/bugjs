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

//@Export('carapace.PanelWithHeaderView')

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
    var PanelWithHeaderView = Class.extend(MustacheView, {

        _name: "carapace.PanelWithHeaderView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="panel-wrapper-{{cid}}" class="panel-wrapper panel-spacing">' +
                '<div id="panel-{{cid}}" class="panel {{classes}}">' +
                    '<div id="panel-header-{{cid}}" class="panel-header">' +
                        '<span id="panel-header-nav-left-{{cid}}" class="panel-header-nav-left"></span>' +
                        '<span class="panel-header-title text text-header">{{attributes.headerTitle}}</span>' +
                        '<span id="panel-header-nav-right-{{cid}}" class="panel-header-nav-right"></span>' +
                    '</div>' +
                    '<div id="panel-body-{{cid}}" class="panel-body">' +
                    '</div>' +
                '</div>' +
            '</div>'
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.PanelWithHeaderView", PanelWithHeaderView);
});
