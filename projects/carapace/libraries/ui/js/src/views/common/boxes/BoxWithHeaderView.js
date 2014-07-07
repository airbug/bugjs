//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.BoxWithHeaderView')

//@Require('Class')
//@Require('carapace.BoxView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var BoxView         = bugpack.require('carapace.BoxView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {BoxView}
     */
    var BoxWithHeaderView = Class.extend(BoxView, {

        _name: "carapace.BoxWithHeaderView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<div id="box-{{cid}}" class="box box-with-header {{classes}}">' +
                        '<div id="box-header-{{cid}}" class="box-header">' +
                        '</div>' +
                        '<div id="box-body-{{cid}}" class="box-body">' +
                        '</div>' +
                    '</div>',


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getBoxHeaderElement: function() {
            return this.findElement("#box-header-{{cid}}");
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.BoxWithHeaderView", BoxWithHeaderView);
});
