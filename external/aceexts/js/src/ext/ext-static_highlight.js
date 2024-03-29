//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('aceexts.StaticHighlight')

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

var StaticHighlight = {};
StaticHighlight.load = function() {

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
        
        ace.define('ace/ext/static_highlight', ['require', 'exports', 'module' , 'ace/edit_session', 'ace/layer/text', 'ace/config'], function(require, exports, module) {
        
        
        var EditSession = require("../edit_session").EditSession;
        var TextLayer = require("../layer/text").Text;
        var baseStyles = ".ace_static_highlight {\
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', 'Droid Sans Mono', monospace;\
        font-size: 12px;\
        }\
        .ace_static_highlight .ace_gutter {\
        width: 25px !important;\
        display: block;\
        float: left;\
        text-align: right;\
        padding: 0 3px 0 0;\
        margin-right: 3px;\
        position: static !important;\
        }\
        .ace_static_highlight .ace_line { clear: both; }\
        .ace_static_highlight .ace_gutter-cell {\
        -moz-user-select: -moz-none;\
        -khtml-user-select: none;\
        -webkit-user-select: none;\
        user-select: none;\
        }";
        var config = require("../config");
        
        exports.render = function(input, mode, theme, lineStart, disableGutter, callback) {
            var waiting = 0;
            var modeCache = EditSession.prototype.$modes;
            if (typeof theme == "string") {
                waiting++;
                config.loadModule(['theme', theme], function(m) {
                    theme = m;
                    --waiting || done();
                });
            }
        
            if (typeof mode == "string") {
                waiting++;
                config.loadModule(['mode', mode], function(m) {
                    if (!modeCache[mode]) modeCache[mode] = new m.Mode();
                    mode = modeCache[mode];
                    --waiting || done();
                });
            }
            function done() {
                var result = exports.renderSync(input, mode, theme, lineStart, disableGutter);
                return callback ? callback(result) : result;
            }
            return waiting || done();
        };
        
        exports.renderSync = function(input, mode, theme, lineStart, disableGutter) {
            lineStart = parseInt(lineStart || 1, 10);
        
            var session = new EditSession("");
            session.setUseWorker(false);
            session.setMode(mode);
        
            var textLayer = new TextLayer(document.createElement("div"));
            textLayer.setSession(session);
            textLayer.config = {
                characterWidth: 10,
                lineHeight: 20
            };
        
            session.setValue(input);
        
            var stringBuilder = [];
            var length =  session.getLength();
        
            for(var ix = 0; ix < length; ix++) {
                stringBuilder.push("<div class='ace_line'>");
                if (!disableGutter)
                    stringBuilder.push("<span class='ace_gutter ace_gutter-cell' unselectable='on'>" + (ix + lineStart) + "</span>");
                textLayer.$renderLine(stringBuilder, ix, true, false);
                stringBuilder.push("</div>");
            }
            var html = "<div class='" + theme.cssClass + "'>" +
                "<div class='ace_static_highlight'>" +
                    stringBuilder.join("") +
                "</div>" +
            "</div>";
        
            textLayer.destroy();
        
            return {
                css: baseStyles + theme.cssText,
                html: html
            };
        };
        
        });
        
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aceexts.StaticHighlight', StaticHighlight);
