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

//@Export('carapace.MultiColumnView')

//@Require('Class')
//@Require('Exception')
//@Require('TypeUtil')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var MustacheView    = bugpack.require('carapace.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var MultiColumnView     = Class.extend(MustacheView, {

        _name: "carapace.MultiColumnView",


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data      = this._super();
            data.rowStyle = "row";

            switch (this.attributes.rowStyle) {
                case MultiColumnView.RowStyle.FLUID:
                    data.rowStyle = "row-fluid";
                    break;
            }
            return data;
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {string} attributeName
         * @param {*} attributeValue
         */
        renderAttribute: function(attributeName, attributeValue) {
            switch (attributeName) {
                case "collapsed":
                    if (attributeValue) {
                        this.getBoxElement().addClass("collapsed-box");
                    } else {
                        this.getBoxElement().removeClass("collapsed-box");
                    }
                    break;
                case "size":
                    this.getBoxElement().removeClass("auto-box fill-box");
                    if (attributeValue === BoxView.Size.AUTO) {
                        this.getBoxElement().addClass("auto-box");
                    } else {
                        this.getBoxElement().addClass("fill-box");
                    }
                    break;
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {jQuery} element
         */
        clearSpanClasses: function(element) {
            element.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
        },

        /**
         * @protected
         * @param {Array.<number>} configArray
         * @param {number} numberRows
         */
        validateConfiguration: function(configArray, numberRows) {
            if (!TypeUtil.isArray(configArray)) {
                throw new Exception("IllegalArgument", {}, "configArray must be an Array");
            }
            if (!TypeUtil.isNumber(numberRows)) {
                throw new Exception("IllegalArgument", {}, "numberRows must be a number");
            }
            var sum = 0;
            for (var i = 0, size = configArray.length; i < size; i++) {
                sum += configArray[i];
            }
            if (sum !== 12) {
                throw new Exception("IllegalAttribute", {}, "Config sum must be 12");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {number}
     */
    MultiColumnView.RowStyle = {
        DEFAULT: 1,
        FIXED: 1,
        FLUID: 2
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.MultiColumnView", MultiColumnView);
});
