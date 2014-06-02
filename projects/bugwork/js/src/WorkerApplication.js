//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugwork.WorkerApplication')
//@Autoload

//@Require('Class')
//@Require('bugapp.Application')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Application         = bugpack.require('bugapp.Application');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Application}
     */
    var WorkerApplication = Class.extend(Application, {

        _name: "bugwork.WorkerApplication",


        //-------------------------------------------------------------------------------
        // Application Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        preProcessApplication: function() {
            this.getModuleTagScan().scanBugpacks([
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
});
