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

//@Export('acethemes.PastelOnDark')

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

var PastelOnDark = {};
PastelOnDark.load = function() {

    ace.define('ace/theme/pastel_on_dark', ['require', 'exports', 'module' , 'ace/lib/dom'], function(require, exports, module) {

        exports.isDark = true;
        exports.cssClass = "ace-pastel-on-dark";
        exports.cssText = ".ace-pastel-on-dark .ace_gutter {\
            background: #353030;\
            color: #8F938F\
            }\
            .ace-pastel-on-dark .ace_print-margin {\
            width: 1px;\
            background: #353030\
            }\
            .ace-pastel-on-dark {\
            background-color: #2C2828;\
            color: #8F938F\
            }\
            .ace-pastel-on-dark .ace_cursor {\
            border-left: 2px solid #A7A7A7\
            }\
            .ace-pastel-on-dark .ace_overwrite-cursors .ace_cursor {\
            border-left: 0px;\
            border-bottom: 1px solid #A7A7A7\
            }\
            .ace-pastel-on-dark .ace_marker-layer .ace_selection {\
            background: rgba(221, 240, 255, 0.20)\
            }\
            .ace-pastel-on-dark.ace_multiselect .ace_selection.ace_start {\
            box-shadow: 0 0 3px 0px #2C2828;\
            border-radius: 2px\
            }\
            .ace-pastel-on-dark .ace_marker-layer .ace_step {\
            background: rgb(102, 82, 0)\
            }\
            .ace-pastel-on-dark .ace_marker-layer .ace_bracket {\
            margin: -1px 0 0 -1px;\
            border: 1px solid rgba(255, 255, 255, 0.25)\
            }\
            .ace-pastel-on-dark .ace_marker-layer .ace_active-line {\
            background: rgba(255, 255, 255, 0.031)\
            }\
            .ace-pastel-on-dark .ace_gutter-active-line {\
            background-color: rgba(255, 255, 255, 0.031)\
            }\
            .ace-pastel-on-dark .ace_marker-layer .ace_selected-word {\
            border: 1px solid rgba(221, 240, 255, 0.20)\
            }\
            .ace-pastel-on-dark .ace_invisible {\
            color: rgba(255, 255, 255, 0.25)\
            }\
            .ace-pastel-on-dark .ace_keyword,\
            .ace-pastel-on-dark .ace_meta {\
            color: #757aD8\
            }\
            .ace-pastel-on-dark .ace_constant,\
            .ace-pastel-on-dark .ace_constant.ace_character,\
            .ace-pastel-on-dark .ace_constant.ace_character.ace_escape,\
            .ace-pastel-on-dark .ace_constant.ace_other {\
            color: #4FB7C5\
            }\
            .ace-pastel-on-dark .ace_keyword.ace_operator {\
            color: #797878\
            }\
            .ace-pastel-on-dark .ace_constant.ace_character {\
            color: #AFA472\
            }\
            .ace-pastel-on-dark .ace_constant.ace_language {\
            color: #DE8E30\
            }\
            .ace-pastel-on-dark .ace_constant.ace_numeric {\
            color: #CCCCCC\
            }\
            .ace-pastel-on-dark .ace_invalid,\
            .ace-pastel-on-dark .ace_invalid.ace_illegal {\
            color: #F8F8F8;\
            background-color: rgba(86, 45, 86, 0.75)\
            }\
            .ace-pastel-on-dark .ace_invalid.ace_deprecated {\
            text-decoration: underline;\
            font-style: italic;\
            color: #D2A8A1\
            }\
            .ace-pastel-on-dark .ace_fold {\
            background-color: #757aD8;\
            border-color: #8F938F\
            }\
            .ace-pastel-on-dark .ace_support.ace_function {\
            color: #AEB2F8\
            }\
            .ace-pastel-on-dark .ace_string {\
            color: #66A968\
            }\
            .ace-pastel-on-dark .ace_string.ace_regexp {\
            color: #E9C062\
            }\
            .ace-pastel-on-dark .ace_comment {\
            color: #A6C6FF\
            }\
            .ace-pastel-on-dark .ace_variable {\
            color: #BEBF55\
            }\
            .ace-pastel-on-dark .ace_variable.ace_language {\
            color: #C1C144\
            }\
            .ace-pastel-on-dark .ace_xml-pe {\
            color: #494949\
            }\
            .ace-pastel-on-dark .ace_indent-guide {\
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYIiPj/8PAARgAh2NTMh8AAAAAElFTkSuQmCC) right repeat-y;\
            }";

        var dom = require("../lib/dom");
        dom.importCssString(exports.cssText, exports.cssClass);
    });
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('acethemes.PastelOnDark', PastelOnDark);


