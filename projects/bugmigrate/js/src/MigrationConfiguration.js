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

//@Export('bugmigrate.MigrationConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ConfigurationTag')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var mongoose            = require('mongoose');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var ConfigurationTag    = bugpack.require('bugioc.ConfigurationTag');
    var IConfiguration      = bugpack.require('bugioc.IConfiguration');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var PropertyTag         = bugpack.require('bugioc.PropertyTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var configuration       = ConfigurationTag.configuration;
    var module              = ModuleTag.module;
    var property            = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MigrationConfiguration = Class.extend(Obj, {

        _name: "bugmigrate.MigrationConfiguration",


        //-------------------------------------------------------------------------------
        // Config Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {console|Console}
         */
        console: function() {
            return console;
        },

        /**
         * @return {*}
         */
        mongoose: function() {
            return mongoose;
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MigrationConfiguration).with(
        configuration("migrationConfiguration").modules([
            module("console"),
            module("mongoose")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("bugmigrate.MigrationConfiguration", MigrationConfiguration);
});
