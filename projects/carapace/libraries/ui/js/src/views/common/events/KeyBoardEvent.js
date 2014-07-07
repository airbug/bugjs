//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.KeyBoardEvent')

//@Require('Class')
//@Require('Event')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Event       = bugpack.require('Event');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Event}
     */
    var KeyBoardEvent = Class.extend(Event, {

        _name: "carapace.KeyBoardEvent",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} eventType
         * @param {number} keyCode
         * @param {boolean} controlKey
         * @param {boolean} shiftKey
         * @param {boolean} altKey
         * @param {jquery.Event} event
         */
        _constructor: function(eventType, keyCode, controlKey, shiftKey, altKey, event) {

            this._super(eventType, {
                event: event
            });


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.altKey         = altKey;

            /**
             * @private
             * @type {boolean}
             */
            this.controlKey     = controlKey;

            /**
             * @private
             * @type {number}
             */
            this.keyCode        = keyCode;

            /**
             * @private
             * @type {boolean}
             */
            this.shiftKey       = shiftKey;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        getAltKey: function() {
            return this.altKey;
        },

        /**
         * @return {boolean}
         */
        getControlKey: function() {
            return this.controlKey;
        },

        /**
         * @return {number}
         */
        getKeyCode: function() {
            return this.keyCode;
        },

        /**
         * @return {boolean}
         */
        getShiftKey: function() {
            return this.shiftKey;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    KeyBoardEvent.EventTypes = {
        KEY_DOWN: "KeyBoardEvent:KeyDown",
        KEY_PRESS: "KeyBoardEvent:KeyPress",
        KEY_UP: "KeyBoardEvent:KeyUp"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.KeyBoardEvent", KeyBoardEvent);
});
