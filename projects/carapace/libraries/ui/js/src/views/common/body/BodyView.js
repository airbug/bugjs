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

//@Export('carapace.BodyView')

//@Require('Class')
//@Require('carapace.CarapaceView')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var CarapaceView    = bugpack.require('carapace.CarapaceView');
    var JQuery          = bugpack.require('jquery.JQuery');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceView}
     */
    var BodyView = Class.extend(CarapaceView, {

        _name: "carapace.BodyView",


        //-------------------------------------------------------------------------------
        // Attributes
        //-------------------------------------------------------------------------------

        el: JQuery('body'),


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        destroyView: function() {
            this.removeAllListeners();
            this.$el.off();
            this.clearModel();
            if (this.viewParent) {
                this.viewParent.removeViewChild(this);
            }
            this.garbageDisposal.removeDisposable(this);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.BodyView", BodyView);
});
