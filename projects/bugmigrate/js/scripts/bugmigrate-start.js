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

//@Require('bugmigrate.MigrationApplication')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context(module);


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var MigrationApplication    = bugpack.require('bugmigrate.MigrationApplication');


//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

var application  = new MigrationApplication();
application.start(function(throwable) {
    if (!throwable) {
        process.exit();
    } else {
        process.exit(1);
    }
});
