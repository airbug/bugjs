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

//@Export('carapace.InteractiveView')

//@Require('Class')
//@Require('carapace.MouseEvent')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var MouseEvent      = bugpack.require('carapace.MouseEvent');
    var MustacheView    = bugpack.require('carapace.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var InteractiveView = Class.extend(MustacheView, {

        _name: "carapace.InteractiveView",


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
            this.handleClick = function(event) {
                //event.preventDefault();
                if (!_this.getAttribute("disabled")) {
                    _this.dispatchEvent(new MouseEvent(MouseEvent.EventType.CLICK, {}));
                }
            };
            this.handleMousedown = function(event) {
                //event.preventDefault();
                if (!_this.getAttribute("disabled")) {
                    _this.dispatchEvent(new MouseEvent(MouseEvent.EventType.DOWN, {}));
                }
            };
            this.handleMouseup = function(event) {
                //event.preventDefault();
                if (!_this.getAttribute("disabled")) {
                    _this.dispatchEvent(new MouseEvent(MouseEvent.EventType.UP, {}));
                }
            };
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.$el.off("click", this.handleClick);
            this.$el.off("mousedown", this.handleMousedown);
            this.$el.off("mouseup", this.handleMouseup);
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            this.$el.on("click", this.handleClick);
            this.$el.on("mousedown", this.handleMousedown);
            this.$el.on("mouseup", this.handleMouseup);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        disableView: function() {
            this.setAttribute("disabled", true);
        },

        /**
         *
         */
        enableView: function() {
            this.setAttribute("disabled", false);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.InteractiveView", InteractiveView);
});
