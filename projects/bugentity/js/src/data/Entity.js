//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('Entity')

//@Require('Class')
//@Require('IObjectable')
//@Require('LiteralUtil')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaBuilder')
//@Require('bugdelta.DeltaDocument')
//@Require('bugdelta.IDelta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var IObjectable     = bugpack.require('IObjectable');
var LiteralUtil     = bugpack.require('LiteralUtil');
var Obj             = bugpack.require('Obj');
var TypeUtil        = bugpack.require('TypeUtil');
var DeltaBuilder    = bugpack.require('bugdelta.DeltaBuilder');
var DeltaDocument   = bugpack.require('bugdelta.DeltaDocument');
var IDelta          = bugpack.require('bugdelta.IDelta');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Entity = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DeltaBuilder}
         */
        this.deltaBuilder           = new DeltaBuilder();

        /**
         * @private
         * @type {DeltaDocument}
         */
        this.deltaDocument          = new DeltaDocument(data || {});

        /**
         * @private
         * @type {?string}
         */
        this.entityType             = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Date}
     */
    getCreatedAt: function() {
        return this.deltaDocument.getData().createdAt;
    },

    /**
     * @param {Date} createdAt
     */
    setCreatedAt: function(createdAt) {
        this.deltaDocument.getData().createdAt = createdAt;
    },

    /**
     * @return {DeltaDocument}
     */
    getDeltaDocument: function() {
        return this.deltaDocument;
    },

    /**
     * @returns {string}
     */
    getEntityType: function() {
        return this.entityType;
    },

    /**
     * @param {string} entityType
     */
    setEntityType: function(entityType) {
        this.entityType = entityType;
    },

    /**
     * @return {string}
     */
    getId: function() {
        var data    = this.deltaDocument.getData();
        if (data.id) {
            return data.id;
        } else if (data._id) {
            return data._id;
        } else {
            return undefined;
        }
    },

    /**
     * @param {string} id
     */
    setId: function(id) {
        var data    = this.deltaDocument.getData();
        if (!data.id && !data._id) {
            data.id     = id;
            data._id    = id;
        } else {
            throw new Error("id is already set! Cannot change id after it's been set.");
        }
    },

    /**
     * @return {Date}
     */
    getUpdatedAt: function() {
        return this.deltaDocument.getData().updatedAt;
    },

    /**
     * @param {Date} updatedAt
     */
    setUpdatedAt: function(updatedAt) {
        this.deltaDocument.getData().updatedAt = updatedAt;
    },


    //-------------------------------------------------------------------------------
    // Obj Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, Entity)) {
            return (Obj.equals(value.getId(), this.getId()));
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[Entity]" + Obj.hashCode(this.getId()));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // IDelta Implementation
    //-------------------------------------------------------------------------------

    /**
     *
     */
    commitDelta: function() {
        this.deltaDocument.commitDelta();
    },

    /**
     * @return {Delta}
     */
    generateDelta: function() {
        return this.deltaBuilder.buildDelta(this.deltaDocument, this.deltaDocument.getPreviousDocument());
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        return Obj.clone(this.deltaDocument.getData(), true);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Entity, IDelta);
Class.implement(Entity, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.Entity', Entity);
