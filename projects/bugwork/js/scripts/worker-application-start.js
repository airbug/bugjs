//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Require('bugwork.WorkerApplication')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context(module);
var domain                      = require('domain');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var WorkerApplication           = bugpack.require('bugwork.WorkerApplication');


//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

var applicationDomain = domain.create();
applicationDomain.on('error', function(error) {
    process.send({
        type: "error",
        data: {
            message: error.message,
            stack: error.stack
        }
    });

    // Note: we're in dangerous territory!
    // By definition, something unexpected occurred,
    // which we probably didn't want.
    // Anything can happen now!  Be very careful!

    gracefulShutdown();
});

var application = new WorkerApplication();
applicationDomain.add(application);
applicationDomain.add(bugpack);
applicationDomain.add(WorkerApplication);
applicationDomain.run(function() {

    console.log("Creating worker application...");
    application.addEventListener(WorkerApplication.EventTypes.STARTED, function(event) {
        console.log("Worker application created!");
        process.send({
            type: "workerReady"
        })
    });
    application.addEventListener(WorkerApplication.EventTypes.STOPPED, function(event) {
        process.exit();
    });
    application.addEventListener(WorkerApplication.EventTypes.ERROR, function(event) {
        process.send({
            type: "error",
            data: {
                message: event.getData().error.message,
                stack: event.getData().error.stack
            }
        });
        if (application.isStarting()) {
            process.exit(1);
        } else if (application.isStarted()) {
            gracefulShutdown();
        } else if (application.isStopping()) {
            //do nothing (try to finish up the stop)
        } else {
            process.exit(1);
        }
    });

    application.start();
});

var gracefulShutdown = function() {
    var killtimer = setTimeout(function() {
        process.exit(1);
    }, 10000);
    killtimer.unref();

    try {
        application.stop();
    } catch(error) {
        process.send({
            type: "error",
            data: {
                message: error.message,
                stack: error.stack
            }
        });
        process.exit(1);
    }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
