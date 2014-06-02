/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugentity.EntityDeltaBuilder')
//@Autoload

//@Require('Class')
//@Require('bugdelta.DeltaBuilder')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityCalculator')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var DeltaBuilder        = bugpack.require('bugdelta.DeltaBuilder');
    var Entity              = bugpack.require('bugentity.Entity');
    var EntityCalculator    = bugpack.require('bugentity.EntityCalculator');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {DeltaBuilder}
     */
    var EntityDeltaBuilder = Class.extend(DeltaBuilder, {

        _name: "bugentity.EntityDeltaBuilder",


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        initialize: function() {
            this._super();
            this.getCalculatorResolver().registerCalculatorForClass(Entity.getClass(), new EntityCalculator(this));
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(EntityDeltaBuilder).with(
        module("entityDeltaBuilder")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.EntityDeltaBuilder', EntityDeltaBuilder);
});
