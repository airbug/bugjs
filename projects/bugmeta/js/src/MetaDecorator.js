//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmeta')

//@Export('MetaDecorator')

//@Require('Class')
//@Require('Obj')
//@Require('bugmeta.Annotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var Annotation              = bugpack.require('bugmeta.Annotation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MetaDecorator = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(reference, metaContext) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MetaContext}
         */
        this.metaContext        = metaContext;

        /**
         * @private
         * @type {*}
         */
        this.reference          = reference;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {...*}
     */
    with: function() {
        for (var i = 0, size = arguments.length; i < size; i++) {
            var annotation = arguments[i];
            if (Class.doesExtend(annotation, Annotation)) {
                annotation.setReference(this.reference);
                this.metaContext.addAnnotation(annotation);
            } else {
                throw new Error("annotation does not extend the Annotation class")
            }
        }

        // NOTE BRN: Return the reference so that whatever function we're annotating is passed through and the reference
        // is assigned correctly.

        return this.reference;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmeta.MetaDecorator', MetaDecorator);
