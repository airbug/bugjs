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

//@Export('carapace.IconView')

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
    var IconView = Class.extend(MustacheView, {

        _name: "carapace.IconView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<i id="{{id}}" class="icon-{{attributes.type}} {{iconColorClass}}"></i>',


        //-------------------------------------------------------------------------------
        // MustacheView Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data = this._super();
            data.id = this.getId() || "icon-" + this.cid;
            data.iconColorClass = "";
            switch (this.attributes.color) {
                case IconView.Color.WHITE:
                    data.iconColorClass += "icon-white";
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
    IconView.Color = {
        BLACK: 1,
        WHITE: 2
    };

    /**
     * @static
     * @enum {string}
     */
    IconView.Type = {
        ALIGN_JUSTIFY:  "align-justify",
        ARROW_DOWN:     "arrow-down",
        ARROW_LEFT:     "arrow-left",
        ARROW_RIGHT:    "arrow-right",
        ARROW_UP:       "arrow-up",
        ASTERISK:       "asterisk",
        BAN_CIRCLE:     "ban-circle",
        BELL:           "bell",
        BOOKMARK:       "bookmark",
        CALENDAR:       "calendar",
        CAMERA:         "camera",
        CHECK:          "check",
        CHEVRON_DOWN:   "chevron-down",
        CHEVRON_LEFT:   "chevron-left",
        CHEVRON_RIGHT:  "chevron-right",
        CHEVRON_UP:     "chevron-up",
        CLOUD_UPLOAD:   "cloud-upload", //3.0.0 only
        COG:            "cog",
        COMMENT:        "comment",
        DOWNLOAD:       "download",
        EDIT:           "edit",
        ENVELOPE:       "envelope",
        EXCLAMATION:    "exclamation-sign",
        EYE_CLOSE:      "eye-close",
        EYE_OPEN:       "eye-open",
        FILE:           "file",
        FIRE:           "fire",
        FLAG:           "flag",
        FULLSCREEN:     "fullscreen",
        GLOBE:          "globe",
        HEART:          "heart",
        INFO_SIGN:      "info-sign",
        HOME:           "home",
        LEAF:           "leaf",
        LIST:           "list",
        MINUS:          "minus",
        MINUS_SIGN:     "minus-sign",
        MOVE:           "move",
        MUSIC:          "music",
        OK:             "ok",
        OK_SIGN:        "ok-sign",
        PAPERCLIP:      "paperclip", //3.0.0 only
        PENCIL:         "pencil",
        OFF:            "off",
        PICTURE:        "picture",
        PLUS:           "plus",
        PLUS_SIGN:      "plus-sign",
        PUSHPIN:        "pushpin", //3.0.0 only
        QUESTION_SIGN:  "question-sign",
        REMOVE:         "remove",
        REMOVE_CIRCLE:  "remove-circle",
        REMOVE_SIGN:    "remove-sign",
        RESIZE_SMALL:   "resize-small",
        RESIZE_FULL:    "resize-full",
        SCREENSHOT:     "screenshot",
        SEARCH:         "search",
        SEND:           "send", //3.0.0 only
        SHARE:          "share",
        SHARE_ALT:      "share-alt",
        STAR:           "star",
        STAR_EMPTY:     "star-empty",
        TH:             "th",
        TH_LARGE:       "th-large",
        TH_LIST:        "th-list",
        UPLOAD:         "upload",
        USER:           "user",
        TIME:           "time",
        TRASH:          "trash",
        VOLUME_DOWN:    "volume-down",
        VOLUME_OFF:     "volume-off",
        VOLUME_UP:      "volume-up",
        WARNING_SIGN:   "warning-sign",
        WRENCH:         "wrench",
        ZOOM_IN:        "zoom-in",
        ZOOM_OUT:       "zoom-out"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.IconView", IconView);
});
