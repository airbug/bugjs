//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('clientjs.ClientPackageRegistry')

//@Require('Class')
//@Require('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Map =       bugpack.require('Map');
var Obj =       bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ClientPackageRegistry = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map<Path, ClientPackageRegistryEntry>}
         */
        this.pathToClientPackageRegistryEntry = new Map();
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    registerPackageDirectory: function(packagesPath) {
        var _packagePaths = null;
        $series([
            $task(function(flow) {
                _this.packagesPath.readDirectory(function(error, paths) {
                    if (!error) {
                        _packagePaths = paths;
                        flow.complete();
                    } else {
                        flow.error(error);
                    }
                });
            }),
            $task(function(flow) {
                $forEachParallel(_packagePaths, function(flow, packagePath) {

                }).execute(function(error) {
                        flow.complete(error);
                    });
            })
        ]).execute(function(error) {
                callback(error);
            });

        //TODO BRN: Build a registry of all packages in the client directory
        //TODO BRN: Iterate though every file in the packages directory
        //TODO BRN: If the file is a tarball, then verify that the tarball has a client.json file
        //TODO BRN: Wrap the tarball in a PackedClientJSPackage class.
        //TODO BRN: (In PackedClientJSPackage) If a client.json file is found, extract the data from the file.
        //TODO BRN: Store the PackedClientJSPackage
        //TODO BRN: For each PackedClientJSPackage, generate an md5 hash of the tarball so that we can detect changes to each file.
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('clientjs.ClientPackageRegistry', ClientPackageRegistry);
