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

//@Export('carapace.ApplicationHeaderView')

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
    var ApplicationHeaderView = Class.extend(MustacheView, {

        _name: "carapace.ApplicationHeaderView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="header-wrapper-{{cid}}" class="navbar">' +
                '<div id="header-{{cid}}" class="container-fluid container-no-pad">' +
                    '<div class="header">' +
                        '<div id="header-left">' +
                        '</div>' +
                        '<div id="header-center">' +
                            '<div id="logo" class="brand" align="center">' +
                                '<img id="logo-image" src="{{{staticUrl}}}/img/carapace-small.png"/>' +
                            '</div>' +
                        '</div>' +
                        '<div id="header-right">' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.ApplicationHeaderView", ApplicationHeaderView);
});
