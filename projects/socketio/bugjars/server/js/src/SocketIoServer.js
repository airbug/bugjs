//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('socketio:server.SocketIoServer')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Proxy')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();
var io              = require('socket.io');


//-------------------------------------------------------------------------------
// BugPack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var EventDispatcher = bugpack.require('EventDispatcher');
var Proxy           = bugpack.require('Proxy');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoServer = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(config, expressServer, handshaker) {

        this._super();

        /**
         * @private
         * @type {SocketIoServerConfig}
         */
        this.config         = config;

        /**
         * @private
         * @type {ExpressServer}
         */
        this.expressServer  = expressServer;

       /**
         * @private
         * @type {Handshaker}
         */
        this.handshaker     = handshaker;

        /**
         * @private
         * @type {*}
         */
        this.ioServer       = io.listen(this.expressServer.getHttpServer());

        Proxy.proxy(this, this.ioServer, [
            "of"
        ]);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {SocketIoServerConfig}
     */
    getConfig: function() {
        return this.config;
    },

    /**
     * @return {ExpressServer}
     */
    getExpressServer: function() {
        return this.expressServer;
    },

    /**
     * @return {Handshaker}
     */
    getHandshaker: function() {
        return this.handshaker;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function()} callback
     */
    configure: function(callback) {
        var _this = this;
        this.ioServer.configure(function() { //NOTE: Can specify an environment flag as the first argument. Defaults to all enviroments
            _this.ioServer.set('authorization', function(handshakeData, callback) {
                //TEST
                console.log("authorization - made it here");

                _this.handshaker.shake(handshakeData, function(throwable, result) {
                    if (!throwable) {

                        //NOTE BRN: This MUST be undefined in order to work.

                        callback(undefined, result);
                    } else {
                        if (throwable) {
                            console.log(throwable.message);
                            console.log(throwable.stack);
                        }
                        callback(throwable, false);
                    }
                });
            });
        });
        this.ioServer.set('match origin protocol', this.config.getMatchOriginProtocol()); //NOTE: Only necessary for use with wss, WebSocket Secure protocol
        this.ioServer.set('resource', this.config.getResource()); //NOTE: forward slash is required here unlike client setting
        this.ioServer.set('transports', this.config.getTransports());
        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('socketio:server.SocketIoServer', SocketIoServer);
