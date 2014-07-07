//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.SelectableListItemView')

//@Require('Class')
//@Require('carapace.ListItemView')
//@Require('carapace.ListViewEvent')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var ListItemView    = bugpack.require('carapace.ListItemView');
    var ListViewEvent   = bugpack.require('carapace.ListViewEvent');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ListItemView}
     */
    var SelectableListItemView = Class.extend(ListItemView, {

        _name: "carapace.SelectableListItemView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="list-item-{{cid}}" class="list-item list-item-{{attributes.size}} clickable-box">' +
             '</div>',



        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} options
         */
        _constructor: function(options) {

            this._super(options);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            var _this = this;

            /**
             * @private
             * @param {jQuery.Event} event
             */
            this.hearListItemClick = function(event) {
                _this.handleListItemClick(event);
            };
        },


        //-------------------------------------------------------------------------------
        // CarapaceView Implementation
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.$el.off("click", this.hearListItemClick);
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            this.$el.on("click", this.hearListItemClick);
        },


        //-------------------------------------------------------------------------------
        // Event Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param event
         */
        handleListItemClick: function(event) {
            event.preventDefault();
            var modelData = this.model ? this.model.toLiteral() : {};
            this.dispatchEvent(new ListViewEvent(ListViewEvent.EventType.ITEM_SELECTED, modelData));
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.SelectableListItemView", SelectableListItemView);
});