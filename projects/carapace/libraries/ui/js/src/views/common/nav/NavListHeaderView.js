//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.NavListHeaderView')

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
    var NavListHeaderView = Class.extend(MustacheView, {

        _name: "carapace.NavListHeaderView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template: '<li id="nav-list-header-{{cid}}" class="nav-header {{classes}}"></li>',


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getNavListHeaderElement: function() {
            return this.findElement("#nav-list-header-{{cid}}");
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.NavListHeaderView", NavListHeaderView);
});