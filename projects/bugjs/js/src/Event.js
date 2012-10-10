//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@export('Event')

//@require('Class')
//@require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Event = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(type, data) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.bubbles = true;

        /**
         * @private
         * @type {*}
         */
        this.data = data;

        /**
         * @private
         * @type {boolean}
         */
        this.propagationStopped = false;

        /**
         * @private
         * @type {*}
         */
        this.target = undefined;

        /**
         * @private
         * @type {string}
         */
        this.type = type;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @return {boolean}
     */
    getBubbles: function() {
        return this.bubbles;
    },

    /**
     * @return {*}
     */
    getData: function() {
        return this.data;
    },

    /**
     * @return {*}
     */
    getTarget: function() {
        return this.target;
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.type;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isPropagationStopped: function() {
        return this.propagationStopped
    },

    /**
     * Prevents an further processing event listeners on parent nodes. All event listeners on the current node will be
     * executed though.
     */
    stopPropagation: function() {
        this.propagationStopped = true;
    }
});
