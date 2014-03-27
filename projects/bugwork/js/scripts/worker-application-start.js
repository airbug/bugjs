//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Require('bugapp.Application')
//@Require('bugwork.WorkerApplication')
//@Require('bugwork.WorkerDefines')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context(module);
var domain                      = require('domain');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Application                 = bugpack.require('bugapp.Application');
var WorkerApplication           = bugpack.require('bugwork.WorkerApplication');
var WorkerDefines               = bugpack.require('bugwork.WorkerDefines');


//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

var applicationDomain = domain.create();
applicationDomain.on('error', function(error) {
    if (process.connected) {
        process.send({
            messageType: WorkerDefines.MessageTypes.WORKER_ERROR,
            error: {
                message: error.message,
                stack: error.stack
            }
        });
    }

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
    application.addEventListener(Application.EventTypes.STARTED, function(event) {
        console.log("Worker application created!");
        process.send({
            messageType: WorkerDefines.MessageTypes.WORKER_READY
        })
    });
    application.addEventListener(Application.EventTypes.STOPPED, function(event) {
        process.exit();
    });
    application.addEventListener(Application.EventTypes.ERROR, function(event) {
        if (process.connected) {
            process.send({
                messageType: WorkerDefines.MessageTypes.WORKER_ERROR,
                error: {
                    message: event.getData().error.message,
                    stack: event.getData().error.stack
                }
            });
        }
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
        if (process.connected) {
            process.send({
                type: WorkerDefines.MessageTypes.WORKER_ERROR,
                data: {
                    message: error.message,
                    stack: error.stack
                }
            });
        }
        process.exit(1);
    }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
