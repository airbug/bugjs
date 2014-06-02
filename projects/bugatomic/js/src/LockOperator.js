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

//@Export('bugatomic.LockOperator')

//@Require('Class')
//@Require('Lock')
//@Require('LockStriped')
//@Require('Map')
//@Require('Obj')
//@Require('bugatomic.ILockOperator')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Lock            = bugpack.require('Lock');
    var LockStriped     = bugpack.require('LockStriped');
    var Map             = bugpack.require('Map');
    var Obj             = bugpack.require('Obj');
    var ILockOperator   = bugpack.require('bugatomic.ILockOperator');
    var BugFlow         = bugpack.require('bugflow.BugFlow');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $task           = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var LockOperator = Class.extend(Obj, {

        _name: "bugatomic.LockOperator",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {number} numberStripes
         */
        _constructor: function(numberStripes) {

            this._super();

            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {number}
             */
            this.numberStripes              = numberStripes;

            /**
             * @private
             * @type {LockStriped}
             */
            this.lockTypeToLockStripedMap   = new Map();
        },


        //-------------------------------------------------------------------------------
        // ILockOperator Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {string} key
         * @param {string} type
         * @param {function(Lock} callback
         */
        acquireLock: function(key, type, callback) {
            var _this = this;
            var lock = null;
            $task(function(flow) {
                var lockStriped = _this.lockTypeToLockStripedMap.get(type);
                if (!lockStriped) {
                    lockStriped = new LockStriped(_this.numberStripes);
                    _this.lockTypeToLockStripedMap.put(type, lockStriped);
                }
                lock = lockStriped.getForKey(key);
                lock.waitLock(function() {
                    flow.complete();
                });
            }).execute(function() {
                callback(lock);
            });
        },

        /**
         * @param {string} key
         * @param {string} type
         * @return {boolean}
         */
        isLockedForType: function(key, type) {
            var lockStriped = this.lockTypeToLockStripedMap.get(type);
            if (lockStriped) {
                var lock = lockStriped.getForKey(key);
                if (lock) {
                    return lock.isLocked();
                }
            }
            return false;
        },

        /**
         * @param {string} key
         * @param {string} type
         */
        releaseLock: function(key, type) {
            var lockStriped = this.lockTypeToLockStripedMap.get(type);
            if (lockStriped) {
                var lock = lockStriped.getForKey(key);
                lock.unlock();
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(LockOperator, ILockOperator);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugatomic.LockOperator', LockOperator);
});
