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

//@Export('clientjs.PackedClientJSPackage')

//@Require('Class')
//@Require('Obj')
//@Require('bugfs.Tarball')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var tar         = require('tar');
    var zlib        = require('zlib');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var Tarball     = bugpack.require('bugfs.Tarball');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var PackedClientJSPackage = Class.extend(Obj, {

        _name: "clientjs.PackedClientJSPackage",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Tarball} tarball
         */
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
});
