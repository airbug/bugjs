//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmigrate.MigrationSchema')
//@Autoload


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
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
