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

//@Export('bugioc.ContextCommandFactory')

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.StartContextCommand')
//@Require('bugioc.StopContextCommand')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var Obj                             = bugpack.require('Obj');
    var StartContextCommand             = bugpack.require('bugioc.StartContextCommand');
    var StopContextCommand              = bugpack.require('bugioc.StopContextCommand');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ContextCommandFactory = Class.extend(Obj, {

        _name: "bugioc.ContextCommandFactory",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {IocContext} iocContext
         * @return {StartContextCommand}
         */
        factoryStartContextCommand: function(iocContext) {
            return new StartContextCommand(iocContext);
        },

        /**
         * @param {IocContext} iocContext
         * @return {StopContextCommand}
         */
        factoryStopContextCommand: function(iocContext) {
            return new StopContextCommand(iocContext);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.ContextCommandFactory', ContextCommandFactory);
});
