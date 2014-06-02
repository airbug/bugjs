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

//@Export('cookies.Cookies')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Cookies = Class.extend(Obj, {

        _name: "cookies.Cookies",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Document} document
         */
        _constructor: function(document) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Document}
             */
            this.document = document;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} key
         * @return {*}
         */
        getCookie: function (key) {
            var value = null;
            if (key && this.hasCookie(key)) {
                value = decodeURIComponent(
                    this.document.cookie.replace(new RegExp("(?:^|.*;\\s*)" +
                        encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") +
                        "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1")
                );
            }
            return value;
        },

        /**
         * @param {string} key
         * @param {*} value
         * @param {?(string|number|Date)} end
         * @param {?string} path
         * @param {?string} domain
         * @param {?boolean} secure
         */
        setCookie: function (key, value, end, path, domain, secure) {
            if (key && !(/^(?:expires|max\-age|path|domain|secure)$/i.test(key))) {
                var expires = "";
                if (end) {
                    if (TypeUtil.isNumber(end)) {
                        expires = end === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + end;
                    } else if (TypeUtil.isString(end)) {
                        expires = "; expires=" + end;
                    } else if (end instanceof Date) {
                        expires = "; expires=" + end.toGMTString();
                    }
                }
                this.document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) +
                    expires +
                    (domain ? "; domain=" + domain : "") +
                    (path ? "; path=" + path : "") +
                    (secure ? "; secure" : "");
            }
        },

        /**
         * @param {string} key
         * @param {string} path
         */
        removeCookie: function (key, path) {
            if (key && this.hasCookie(key)) {
                this.document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
                    (path ? "; path=" + path : "");
            }
        },

        /**
         * @param {string} key
         * @return {boolean}
         */
        hasCookie: function (key) {
            return (new RegExp("(?:^|;\\s*)" +
                encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(this.document.cookie);
        },

        /**
         * @return {Array}
         */
        keys: function () {
            var keys = this.document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "")
                .split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nIdx = 0; nIdx < keys.length; nIdx++) {
                keys[nIdx] = decodeURIComponent(keys[nIdx]);
            }
            return keys;
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('cookies.Cookies', Cookies);
});
