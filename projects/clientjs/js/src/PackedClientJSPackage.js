//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('clientjs.PackedClientJSPackage')

//@Require('Class')
//@Require('Obj')
//@Require('bugfs.Tarball')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();
var tar = require('tar');
var zlib = require('zlib');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Obj = bugpack.require('Obj');
var Tarball = bugpack.require('bugfs.Tarball');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PackedClientJSPackage = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(tarball) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {?string}
         */
        this.name = null;

        /**
         * @private
         * @type {Tarball}
         */
        this.tarball = tarball;

        /**
         * @private
         * @type {?string}
         */
        this.version = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getName: function() {
        return this.name;
    },

    /**
     * @return {string}
     */
    getVersion: function() {
        return this.version;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isClientJSPackage: function() {

        //TODO BRN: If data has not been extracted from tarball, extract data from the tarball using a stream
        //If the data extracts, then we have a client package.

        var readStream = fs.createReadStream(this.getAbsolutePath());
        readStream.pipe(zlib.createGunzip()).pipe(tar.Parse())
            .on("entry", function (entry) {
                if (entry.props.path === "package/package.json") {
                    packageJsonFound = true;
                    var jsonString = "";
                    entry.on("data", function (c) {
                        jsonString += c.toString();
                    });
                    entry.on("end", function () {
                        moduleData = JSON.parse(jsonString);

                        //TODO BRN: No need to look any further

                        //readStream.destroy();
                    });
                }
            })
            .on("end", function() {
                readStream.destroy();
                if (!packageJsonFound) {
                    callback(new Error("Could not find package.json in file '" + modulePath.getAbsolutePath() + "'"));
                } else {
                    callback(null, moduleData);
                }
            });
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?(boolean|function(Error, Path))=} resolveSymlink (defaults to false)
     * @param {?function(Error)} callback
     */
    extractPackageInto: function(intoPath, resolveSymlink, callback) {
        this.tarball.extractInto(intoPath, resolveSymlink, callback);
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {Path} path
 * @return {boolean}
 */
PackedClientJSPackage.isClientJSPackage = function(path) {
    var packedClientJSPackage = new PackedClientJSPackage(new Tarball(path));
    return packedClientJSPackage.isClientJSPackage();
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('clientjs.PackedClientJSPackage', PackedClientJSPackage);
