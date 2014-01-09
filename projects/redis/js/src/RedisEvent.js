//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('redis')

//@Export('RedisEvent')

//@Require('Class')
//@Require('Event')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Event               = bugpack.require('Event');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RedisEvent = Class.extend(Event, {});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
RedisEvent.EventTypes = {
    CONNECT: "RedisEvent:Connect",
    DRAIN: "RedisEvent:Drain",
    END: "RedisEvent:End",
    ERROR: "RedisEvent:Error",
    IDLE: "RedisEvent:Idle",
    MESSAGE: "RedisEvent:Message",
    READY: "RedisEvent:Ready",
    SUBSCRIBE: "RedisEvent:Subscribe",
    UNSUBSCRIBE: "RedisEvent:Unsubscribe"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('redis.RedisEvent', RedisEvent);
