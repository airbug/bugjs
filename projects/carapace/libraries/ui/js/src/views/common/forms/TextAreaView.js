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

//@Export('carapace.TextAreaView')

//@Require('Class')
//@Require('TypeUtil')
//@Require('carapace.KeyBoardEvent')
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
    var KeyBoardEvent   = bugpack.require('carapace.KeyBoardEvent');
    var MustacheView    = bugpack.require('carapace.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var TextAreaView = Class.extend(MustacheView, {

        _name: "carapace.TextAreaView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<textarea id="text-area-{{cid}}" class="{{classes}}" name="{{attributes.name}}" rows="{{attributes.rows}}">{{attributes.placeholder}}</textarea>',


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {Object}
         */
        generateTemplateData: function() {
            var data = this._super();
            if (!TypeUtil.isNumber(data.attributes.rows)) {
                data.attributes.rows = 2;
            }
            return data;
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.$el.off();
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            var _this = this;
            this.$el.on('keydown', function(event) {
                _this.handleKeyDown(event);
            });
            this.$el.on('keypress', function(event) {
                _this.handleKeyPress(event);
            });
            this.$el.on('keyup', function(event) {
                _this.handleKeyUp(event);
            });
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @returns {number}
         */
        getCaret: function() {
            var el = this.$el[0];
            if (el.selectionStart) {
                return el.selectionStart;
            } else if (document.selection) {
                el.focus();

                var r = document.selection.createRange();
                if (r == null) {
                    return 0;
                }

                var re = el.createTextRange();
                var rc = re.duplicate();
                re.moveToBookmark(r.getBookmark());
                rc.setEndPoint('EndToStart', re);

                return rc.text.length;
            }
            return 0;
        },

        /**
         * @param {number} position
         */
        setCaret: function(position) {
            this.setSelectionRange(position, position);
        },

        /**
         * @param {number} selectionStart
         * @param {number} selectionEnd
         */
        setSelectionRange: function(selectionStart, selectionEnd) {
            var el = this.$el[0];
            if (el.setSelectionRange) {
                el.focus();
                el.setSelectionRange(selectionStart, selectionEnd);
            } else if (el.createTextRange) {
                var range = el.createTextRange();
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            }
        },

        /**
         * @returns {*}
         */
        getValue: function() {
            return this.$el.val();
        },

        /**
         * @param {*} value
         */
        setValue: function(value) {
            this.$el.val(value);
        },


        //-------------------------------------------------------------------------------
        // Event Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleKeyDown: function(event) {
            this.dispatchEvent(new KeyBoardEvent(KeyBoardEvent.EventTypes.KEY_DOWN, event.keyCode, event.ctrlKey, event.shiftKey, event.altKey, event));
        },

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleKeyPress: function(event) {
            this.dispatchEvent(new KeyBoardEvent(KeyBoardEvent.EventTypes.KEY_PRESS, event.keyCode, event.ctrlKey, event.shiftKey, event.altKey, event));
        },

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleKeyUp: function(event) {
            this.dispatchEvent(new KeyBoardEvent(KeyBoardEvent.EventTypes.KEY_UP, event.keyCode, event.ctrlKey, event.shiftKey, event.altKey, event));
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.TextAreaView", TextAreaView);
});
