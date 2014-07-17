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

//@Export('npm.Npm')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('StringUtil')
//@Require('Flows')
//@Require('bugfs.BugFs')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var child_process   = require('child_process');
    var fs              = require('fs');
    var path            = require('path');
    var tar             = require('tar');
    var zlib            = require('zlib');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var Obj             = bugpack.require('Obj');
    var StringUtil      = bugpack.require('StringUtil');
    var Flows         = bugpack.require('Flows');
    var BugFs           = bugpack.require('bugfs.BugFs');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $if             = Flows.$if;
    var $task           = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Npm = Class.extend(Obj, {

        _name: "npm.Npm",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------


        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} installPath
         * @param {function(Throwable=)} callback
         */
        createInstallDir: function(installPath, callback) {
            BugFs.createDirectory(installPath + "/node_modules", callback);
        },

        /**
         * @param {string} modulePath
         * @param {string} installPath
         * @param {function(Throwable, Object=)=} callback
         */
        installNodeModule: function(modulePath, installPath, callback) {
            this.getModuleData(modulePath, function(throwable, moduleData) {
                if (!throwable) {
                    var npmDirname = path.dirname(require.resolve('npm'));
                    var npmBin = path.resolve(npmDirname, "../..", ".bin/npm");
                    var child = child_process.spawn(npmBin, ['install', modulePath], {cwd: installPath, env: process.env});
                    child.stdout.setEncoding('utf8');
                    child.stdout.on('data', function (data) {
                        console.log(StringUtil.trim(data));
                    });
                    child.stderr.setEncoding('utf8');
                    child.stderr.on('data', function (data) {
                        console.log(StringUtil.trim(data));
                    });
                    child.on('close', function (code) {
                        if (code !== 0) {
                            callback(new Bug("InstallError", {}, "An error occurred during install of module '" + modulePath + "'"));
                        } else {
                            var installedPath = BugFs.joinPaths([installPath, "node_modules", moduleData.name]).getAbsolutePath();
                            var data = {
                                installedPath: installedPath,
                                name: moduleData.name,
                                version: moduleData.version
                            };
                            callback(null, data);
                        }
                    });
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {string} modulePathString
         * @param {function(Error, {
         *      name: string,
         *      version: string
         * })} callback
         */
        getModuleData: function(modulePathString, callback) {
            var _this       = this;
            var modulePath  = BugFs.path(modulePathString);
            var moduleData  = null;
            $if (function(flow) {
                    modulePath.isDirectory(function(error, result) {
                        if (!error) {
                            flow.assert(result);
                        } else {
                            flow.error(error);
                        }
                    });
                },
                $task(function(flow) {
                    _this.getModuleDataFromFolder(modulePath, function(error, data) {
                        if (!error) {
                            moduleData = data;
                            flow.complete();
                        } else {
                            flow.error(error);
                        }
                    });
                })
            ).$elseIf (function(flow) {
                    modulePath.isFile(function(error, result) {
                        if (!error) {
                            flow.assert(result);
                        } else {
                            flow.error(error);
                        }
                    });
                },
                $task(function(flow) {
                    var ext = BugFs.path(modulePath).getExtName();
                    if (ext === ".tgz") {
                        _this.getModuleDataFromTarball(modulePath, function(error, data) {
                            if (!error) {
                                moduleData = data;
                                flow.complete();
                            } else {
                                flow.error(error);
                            }
                        });
                    } else {
                        flow.error(new Exception("NotAModule", {}, "Not a module '" + modulePath.getAbsolutePath() + "'"));
                    }
                })
            ).$else (
                $task(function(flow) {
                    flow.error(new Exception("UnhandledModuleType", {}, "Cannot open module '" + modulePath.getAbsolutePath() + "' because it is an " +
                        "unknown type."));
                })
            ).execute(function(error) {
                callback(error, moduleData);
            });
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Path} modulePath
         * @param {function(Throwable, {
         *     name: string,
         *     version: string
         * }=)} callback
         */
        getModuleDataFromFolder: function(modulePath, callback) {
            var packageJsonPath = BugFs.joinPaths(modulePath, "package.json");
            var moduleData = {};
            $if (function(flow) {
                    packageJsonPath.isFile(function(error, result) {
                        if (!error) {
                            flow.assert(result);
                        } else {
                            flow.error(error);
                        }
                    });
                },
                $task(function(flow) {
                    //TODO BRN: retrieve the name and version data from the package.json file
                })
            ).$else (
                $task(function(flow) {
                    flow.error(new Exception("NoPackageJson", {}, "Cannot get module data from '" + modulePath.getAbsolutePath() + "' because " +
                        "the package.json file cannot be found"));
                })
            ).execute(function(error) {
                    if (!error) {
                        callback(null, moduleData);
                    } else {
                        callback(error);
                    }
                });
        },

        /**
         * @private
         * @param {Path} modulePath
         * @param {function(Throwable, {
         *     name: string,
         *     version: string
         * }=)} callback
         */
        getModuleDataFromTarball: function(modulePath, callback) {
            var moduleData = null;
            var packageJsonFound = false;
            var readStream = fs.createReadStream(modulePath.getAbsolutePath());
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
                        callback(new Exception("NoPackageJson", {}, "Could not find package.json in file '" + modulePath.getAbsolutePath() + "'"));
                    } else {
                        callback(null, moduleData);
                    }
                });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("npm.Npm", Npm);
});
