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

//@Export('redis.RedisEvent')

//@Require('Class')
//@Require('Event')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Event   = bugpack.require('Event');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var RedisEvent = Class.extend(Event, {
        _name: "redis.RedisEvent"
    });


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
});
