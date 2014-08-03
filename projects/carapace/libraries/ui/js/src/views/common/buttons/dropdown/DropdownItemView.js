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

//@Export('carapace.DropdownItemView')

//@Require('Class')
//@Require('carapace.DropdownViewEvent')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var DropdownViewEvent   = bugpack.require('carapace.DropdownViewEvent');
    var MustacheView        = bugpack.require('carapace.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var DropdownItemView = Class.extend(MustacheView, {

        _name: "carapace.DropdownItemView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<li><a id="dropdown-item-{{cid}}" tabindex="-1"></a></li>',


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} options
         */
        _constructor: function(options) {

            this._super(options);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            var _this = this;

            /**
             * @private
             * @param {jQuery.Event} event
             */
            this.hearDropdownItemClick = function(event) {
                _this.handleDropdownItemClick(event);
            };
        },


        //-------------------------------------------------------------------------------
        // CarapaceView Extensions
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.$el.off('click', this.hearDropdownItemClick);
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            this.$el.on('click', this.hearDropdownItemClick);
        },


        //-------------------------------------------------------------------------------
        // View Event Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleDropdownItemClick: function(event) {
            event.preventDefault();
            event.stopPropagation();
            this.dispatchEvent(new DropdownViewEvent(DropdownViewEvent.EventType.DROPDOWN_SELECTED));
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.DropdownItemView", DropdownItemView);
});
