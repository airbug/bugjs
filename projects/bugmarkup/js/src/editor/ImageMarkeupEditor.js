//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('ImageMarkupEditor')

//@Require('Class')
//@Require('Obj')
//@Require('fabric.Fabric')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var Fabric          = bugpack.require('fabric.Fabric');
var JQuery          = bugpack.require('jquery.JQuery');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ImageMarkupEditor = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Fabric}
         */
        this.fabricCanvas               = undefined;

        /**
         * @private
         * @type {JQuery}
         */
        this.imageMarkupCanvas          = undefined;

        /**
         * @private
         * @type {JQuery}
         */
        this.imageMarkupArrowButton     = undefined;

        /**
         * @private
         * @type {JQuery}
         */
        this.imageMarkupTextButton      = undefined;

        /**
         * @private
         * @type {JQuery}
         */
        this.imageMarkupLoader          = undefined;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    activate: function() {

    },

    deactivate: function() {
        this.fabricCanvas.clear();
    },

    loadImage: function(imageUrl) {
        this.imageMarkupLoader.show();
        var _this = this;
        var image = new Image();
        image.src = imageUrl;
        image.addEventListener("load", function(event) {
           console.log("loaded");
            _this.imageMarkupLoader.hide();
            var fabricImage = new Fabric.Image(image, {});
            _this.fabricCanvas.add(fabricImage);
        });
        image.addEventListener("error", function(event) {
            console.log("error");
            _this.imageMarkupLoader.hide();
        });
    },

    /**
     *
     */
    initialize: function() {
        var _this = this;
        this.imageMarkupCanvas          = JQuery("image-markup-canvas");
        this.imageMarkupArrowButton     = JQuery("image-markup-arrow-button");
        this.imageMarkupTextButton      = JQuery("image-markup-text-button");
        this.imageMarkupLoader          = JQuery("image-markup-loader-wrapper");
        this.imageMarkupArrowButton.on("click", function(event) {
            _this.hearArrowButtonClick(event);
        });
        this.fabricCanvas               = new Fabric.Canvas('image-markup-canvas', {
            interactive: false
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearArrowButtonClick: function(event) {

    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.ImageMarkupEditor', ImageMarkupEditor);
