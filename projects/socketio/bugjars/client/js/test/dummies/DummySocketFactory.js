//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('socketio:client.DummySocketFactory')

//@Require('Class')
//@Require('Obj')
//@Require('socketio:client.DummySocketConnection')
//@Require('socketio:client.ISocketFactory')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var DummySocketConnection   = bugpack.require('socketio:client.DummySocketConnection');
var ISocketFactory          = bugpack.require('socketio:client.ISocketFactory');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DummySocketFactory = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(startConnected) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DummySocketConnection}
         */
        this.dummySocketConnection = null;

        /**
         * @private
         * @type {boolean}
         */
        this.startConnected = startConnected;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {DummySocketConnection}
     */
    getDummySocketConnection: function() {
        return this.dummySocketConnection;
    },


    //-------------------------------------------------------------------------------
    // ISocketFactory Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {string} host
     * @param {{
        *     port: number,
     *     resource: string
     * }} options
     * @return {DummySocketConnection}
     */
    createSocketConnection: function(host, options) {
        this.dummySocketConnection = new DummySocketConnection({host: host, options: options}, this.startConnected);
        return this.dummySocketConnection;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(DummySocketFactory, ISocketFactory);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("socketio:client.DummySocketFactory", DummySocketFactory);
