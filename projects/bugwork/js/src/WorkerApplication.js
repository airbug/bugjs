//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugwork.WorkerApplication')
//@Autoload

//@Require('Class')
//@Require('bugapp.Application')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Application                         = bugpack.require('bugapp.Application');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Application}
 */
var WorkerApplication = Class.extend(Application, {

    //-------------------------------------------------------------------------------
    // Application Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    preProcessApplication: function() {
        this.getModuleScan().scanBugpacks([
            "bugmarsh.MarshRegistry",
            "bugmarsh.Marshaller",
            "bugwork.WorkerRegistry",
            "bugwork.WorkerRunner"
        ]);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugwork.WorkerApplication', WorkerApplication);
