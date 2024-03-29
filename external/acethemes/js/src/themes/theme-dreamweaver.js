/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('acethemes.Dreamweaver')

//@Require('ace.Ace')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var ace = bugpack.require('ace.Ace');

//-------------------------------------------------------------------------------
//
//-------------------------------------------------------------------------------

var Dreamweaver = {};
Dreamweaver.load = function() {

    ace.define('ace/theme/dreamweaver', ['require', 'exports', 'module' , 'ace/lib/dom'], function(require, exports, module) {
        exports.isDark = false;
        exports.cssClass = "ace-dreamweaver";
        exports.cssText = ".ace-dreamweaver .ace_gutter {\
            background: #e8e8e8;\
            color: #333;\
            }\
            .ace-dreamweaver .ace_print-margin {\
            width: 1px;\
            background: #e8e8e8;\
            }\
            .ace-dreamweaver {\
            background-color: #FFFFFF;\
            }\
            .ace-dreamweaver .ace_fold {\
            background-color: #757AD8;\
            }\
            .ace-dreamweaver .ace_cursor {\
            border-left: 2px solid black;\
            }\
            .ace-dreamweaver .ace_overwrite-cursors .ace_cursor {\
            border-left: 0px;\
            border-bottom: 1px solid black;\
            }\
            .ace-dreamweaver .ace_invisible {\
            color: rgb(191, 191, 191);\
            }\
            .ace-dreamweaver .ace_storage,\
            .ace-dreamweaver .ace_keyword {\
            color: blue;\
            }\
            .ace-dreamweaver .ace_constant.ace_buildin {\
            color: rgb(88, 72, 246);\
            }\
            .ace-dreamweaver .ace_constant.ace_language {\
            color: rgb(88, 92, 246);\
            }\
            .ace-dreamweaver .ace_constant.ace_library {\
            color: rgb(6, 150, 14);\
            }\
            .ace-dreamweaver .ace_invalid {\
            background-color: rgb(153, 0, 0);\
            color: white;\
            }\
            .ace-dreamweaver .ace_support.ace_function {\
            color: rgb(60, 76, 114);\
            }\
            .ace-dreamweaver .ace_support.ace_constant {\
            color: rgb(6, 150, 14);\
            }\
            .ace-dreamweaver .ace_support.ace_type,\
            .ace-dreamweaver .ace_support.ace_class {\
            color: #009;\
            }\
            .ace-dreamweaver .ace_support.ace_php_tag {\
            color: #f00;\
            }\
            .ace-dreamweaver .ace_keyword.ace_operator {\
            color: rgb(104, 118, 135);\
            }\
            .ace-dreamweaver .ace_string {\
            color: #00F;\
            }\
            .ace-dreamweaver .ace_comment {\
            color: rgb(76, 136, 107);\
            }\
            .ace-dreamweaver .ace_comment.ace_doc {\
            color: rgb(0, 102, 255);\
            }\
            .ace-dreamweaver .ace_comment.ace_doc.ace_tag {\
            color: rgb(128, 159, 191);\
            }\
            .ace-dreamweaver .ace_constant.ace_numeric {\
            color: rgb(0, 0, 205);\
            }\
            .ace-dreamweaver .ace_variable {\
            color: #06F\
            }\
            .ace-dreamweaver .ace_xml-pe {\
            color: rgb(104, 104, 91);\
            }\
            .ace-dreamweaver .ace_entity.ace_name.ace_function {\
            color: #00F;\
            }\
            .ace-dreamweaver .ace_heading {\
            color: rgb(12, 7, 255);\
            }\
            .ace-dreamweaver .ace_list {\
            color:rgb(185, 6, 144);\
            }\
            .ace-dreamweaver .ace_marker-layer .ace_selection {\
            background: rgb(181, 213, 255);\
            }\
            .ace-dreamweaver .ace_marker-layer .ace_step {\
            background: rgb(252, 255, 0);\
            }\
            .ace-dreamweaver .ace_marker-layer .ace_stack {\
            background: rgb(164, 229, 101);\
            }\
            .ace-dreamweaver .ace_marker-layer .ace_bracket {\
            margin: -1px 0 0 -1px;\
            border: 1px solid rgb(192, 192, 192);\
            }\
            .ace-dreamweaver .ace_marker-layer .ace_active-line {\
            background: rgba(0, 0, 0, 0.07);\
            }\
            .ace-dreamweaver .ace_marker-layer .ace_selected-word {\
            background: rgb(250, 250, 255);\
            border: 1px solid rgb(200, 200, 250);\
            }\
            .ace-dreamweaver .ace_meta.ace_tag {\
            color:#009;\
            }\
            .ace-dreamweaver .ace_meta.ace_tag.ace_anchor {\
            color:#060;\
            }\
            .ace-dreamweaver .ace_meta.ace_tag.ace_form {\
            color:#F90;\
            }\
            .ace-dreamweaver .ace_meta.ace_tag.ace_image {\
            color:#909;\
            }\
            .ace-dreamweaver .ace_meta.ace_tag.ace_script {\
            color:#900;\
            }\
            .ace-dreamweaver .ace_meta.ace_tag.ace_style {\
            color:#909;\
            }\
            .ace-dreamweaver .ace_meta.ace_tag.ace_table {\
            color:#099;\
            }\
            .ace-dreamweaver .ace_string.ace_regex {\
            color: rgb(255, 0, 0)\
            }\
            .ace-dreamweaver .ace_indent-guide {\
            background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;\
            }";

        var dom = require("../lib/dom");
        dom.importCssString(exports.cssText, exports.cssClass);
    });
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('acethemes.Dreamweaver', Dreamweaver);
