//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('aceexts.Statusbar')

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

var Statusbar = {};
Statusbar.load = function() {

    ace.define('ace/ext/statusbar', ['require', 'exports', 'module' , 'ace/lib/dom', 'ace/lib/lang'], function(require, exports, module) {
        var dom = require("ace/lib/dom");
        var lang = require("ace/lib/lang");
        
        var StatusBar = function(editor, parentNode) {
            this.element = dom.createElement("div");
            this.element.className = "ace_status-indicator";
            this.element.style.cssText = "display: inline-block;";
            parentNode.appendChild(this.element);
        
            var statusUpdate = lang.delayedCall(function(){
                this.updateStatus(editor)
            }.bind(this));
            editor.on("changeStatus", function() {
                statusUpdate.schedule(100);
            });
            editor.on("changeSelection", function() {
                statusUpdate.schedule(100);
            });
        };
        
        (function(){
            this.updateStatus = function(editor) {
                var status = [];
                function add(str, separator) {
                    str && status.push(str, separator || "|");
                }
        
                if (editor.$vimModeHandler)
                    add(editor.$vimModeHandler.getStatusText());
                else if (editor.commands.recording)
                    add("REC");
        
                var c = editor.selection.lead;
                add(c.row + ":" + c.column, " ");
                if (!editor.selection.isEmpty()) {
                    var r = editor.getSelectionRange();
                    add("(" + (r.end.row - r.start.row) + ":"  +(r.end.column - r.start.column) + ")");
                }
                status.pop();
                this.element.textContent = status.join("");
            };
        }).call(StatusBar.prototype);
        
        exports.StatusBar = StatusBar;
        
        });
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aceexts.Statusbar', Statusbar);
