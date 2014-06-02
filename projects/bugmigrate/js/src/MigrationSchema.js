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

//@Export('bugmigrate.MigrationSchema')
//@Autoload


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var mongoose    = require('mongoose');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var Schema      = mongoose.Schema;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    var MigrationSchema = new Schema({
        createdAt:  {type: Date,    required: true, default: Date.now},
        name:       {type: String,  required: true},
        updatedAt:  {type: Date,    required: true, default: Date.now,  index: true},
        version:    {type: String,  required: true},
        appVersion: {type: String,  required: true}
    });

    MigrationSchema.index({appVersion: 1, version: 1, name: 1}, {unique: true});


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmigrate.MigrationSchema', MigrationSchema);
});
