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

//@Export('bugentity.EntityCalculator')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaCalculator')
//@Require('bugdelta.ObjectChange')
//@Require('bugentity.Entity')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var TypeUtil            = bugpack.require('TypeUtil');
    var DeltaCalculator     = bugpack.require('bugdelta.DeltaCalculator');
    var ObjectChange        = bugpack.require('bugdelta.ObjectChange');
    var Entity              = bugpack.require('bugentity.Entity');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {DeltaCalculator}
     */
    var EntityCalculator = Class.extend(DeltaCalculator, {

        _name: "bugentity.EntityCalculator",


        //-------------------------------------------------------------------------------
        // DeltaCalculator Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Delta} delta
         * @param {string} currentPath
         * @param {*} currentValue
         * @param {*} previousValue
         */
        calculateDelta: function(delta, currentPath, currentValue, previousValue) {
            if (!currentValue || !Class.doesExtend(currentValue, Entity)) {
                throw new Error("EntityCalculator expects currentValue to be an Entity");
            }
            if (!previousValue || !Class.doesExtend(currentValue, Entity)) {
                throw new Error("EntityCalculator expects previousValue to be an Entity");
            }

            var currentDocument     = currentValue.getDeltaDocument();
            var previousDocument    = previousValue.getDeltaDocument();
            var deltaCalculator = this.getDeltaBuilder().getCalculatorResolver().resolveCalculator(currentDocument);
            deltaCalculator.calculateDelta(delta, currentPath, currentDocument, previousDocument);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.EntityCalculator', EntityCalculator);
});
