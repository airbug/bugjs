//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.BodyView')

//@Require('Class')
//@Require('carapace.CarapaceView')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var CarapaceView    = bugpack.require('carapace.CarapaceView');
    var JQuery          = bugpack.require('jquery.JQuery');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceView}
     */
    var BodyView = Class.extend(CarapaceView, {

        _name: "carapace.BodyView",


        //-------------------------------------------------------------------------------
        // Attributes
        //-------------------------------------------------------------------------------

        el: JQuery('body'),


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        destroyView: function() {
            this.removeAllListeners();
            this.$el.off();
            this.clearModel();
            if (this.viewParent) {
                this.viewParent.removeViewChild(this);
            }
            this.garbageDisposal.removeDisposable(this);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.BodyView", BodyView);
});
