/**
 * Based on the google closure library.
 * http://closure-library.googlecode.com/svn/docs/class_goog_structs_Set.html
 *
 * A Set
 * 1) Cannot contain duplicate elements.
 * 2) A 'duplicate' is considered any object where o1.equals(o2) or any primitive value where v1 === v2
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Set')

//@Require('Class')
//@Require('Collection')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Collection      = bugpack.require('Collection');
var Obj             = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Set = Class.extend(Collection, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {(Collection.<*> | Array.<*>)} items
     */
    _constructor: function(items) {

        this._super(items);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {Set}
     */
    clone: function(deep) {
        var cloneSet = new Set();
        if(deep){
            this.forEach(function(item){
                cloneSet.add(Obj.clone(item, true));
            });
        } else {
            cloneSet.addAll(this);
        }
        return cloneSet;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    add: function(value) {
        if (!this.hashStore.hasValue(value)) {
            this.hashStore.addValue(value);
            return true;
        }
        return false;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Set', Set);
