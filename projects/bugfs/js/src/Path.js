//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('Path')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')

var bugpack = require('bugpack');
var fs = require('fs');
var path = require('path');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugBoil = bugpack.require('BugBoil');
var BugFlow = bugpack.require('BugFlow');
var Class = bugpack.require('Class');
var Obj = bugpack.require('Obj');
var TypeUtil = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $foreach = BugBoil.$foreach;
var $if = BugFlow.$if;
var $series = BugFlow.$series;
var $task = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Path = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(givenPath) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.absolutePath = path.normalize(givenPath);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getAbsolutePath: function() {
        return this.absolutePath;
    },

    /**
     * @return {string}
     */
    getName: function() {
        return path.basename(this.getAbsolutePath());
    },

    /**
     * @return {Path}
     */
    getParentPath: function() {
        //TODO BRN: Figure out how this behaves when we get down to the /
        var parentPath = path.dirname(this.getAbsolutePath());
        return new Path(parentPath);
    },

    /**
     * @param {Path} intoPath
     * @return {string}
     */
    getRelativePath: function(intoPath) {
        return path.relative(this.getAbsolutePath(), intoPath.getAbsolutePath());
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, Path)) {
            return (value.getAbsolutePath() === this.getAbsolutePath());
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[Path]" + Obj.hashCode(this.getAbsolutePath()));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    //TODO BRN: add option for "preserve" See http://en.wikipedia.org/wiki/Cp_(Unix) for description. Determine if node js already does this under the hood.

    /**
     * Rules for copy
     * 1) If this Path is a directory, it will perform a copyDirectory call
     * 2) If this Path is a file, it will perform a copyFile call
     * @param {(string|Path)} intoPath
     * @param {?(boolean|function(Error))=} recursive (defaults to true)
     * @param {?(Path.SyncMode|function(Error))=} syncMode (defaults to Path.SyncMode.STOP)
     * @param {?function(Error, Path)} callback
     */
    copy: function(intoPath, recursive, syncMode, callback) {
        if (TypeUtil.isFunction(recursive)) {
            callback = recursive;
        }
        if (TypeUtil.isFunction(syncMode)) {
            callback = syncMode;
        }
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;
        var _this = this;
        var _copyPath = new Path(intoPath.getAbsolutePath() + path.sep + _this.getName());
        $series([
            $task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot copy path '" + _this.getAbsolutePath() + "' because it does " +
                            "not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            $task(function(flow) {
                _this.ensureCopyIntoPath(intoPath, function(error) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this._copy(_copyPath, recursive, syncMode, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(error) {
            if (!error) {
                callback(null, _copyPath);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?boolean=} recursive
     * @param {?Path.SyncMode=} syncMode
     * @return {Path}
     */
    copySync: function(intoPath, recursive, syncMode) {
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;

        var copyPath = new Path(intoPath.getAbsolutePath() + path.sep + this.getName());
        if (!this.existsSync()) {
            throw new Error("Cannot copy path '" + this.getAbsolutePath() + "' because it does not exist.")
        }
        this.ensureCopyIntoPathSync(intoPath);
        this._copySync(copyPath, recursive, syncMode);
        return copyPath;
    },

    //TODO BRN: add option for "preserve" See http://en.wikipedia.org/wiki/Cp_(Unix) for description.
    /**
     * Rules for DIRECTORY copy
     * 1) The intoPath must be a directory (or not created).
     * 2) If the intoPath does not exist, this function will attempt to create the intoPath.
     * 3) This will not copy files recursively unless the "recursive" option is set to true.
     * 4) This function will look in the intoPath for a path by the name of this directory
     * 4a) If a path by the name of this one does NOT exist, it will create a directory with this name. The
     * directory's contents will then be copied in to the newly created directory.
     * 4b) If a path by the name of this one exists, it will take one of the following actions based upon the
     * SyncMode
     *
     * SyncMode.MERGE_REPLACE
     * If the Path is a directory, this directory's contents will be copied in to the currently existing directory.
     * If the Path is a file, the file will be removed and this directory will be copied.
     *
     * SyncMode.MERGE_STOP
     * If the Path is a directory, this directory's contents will be copied in to the currently existing directory.
     * If the Path is a file, the file will be left alone and this directory will not be copied.
     *
     * SyncMode.REPLACE
     * If the Path is a directory, it will be removed and this directory will be copied.
     * If the Path is a file, it will be removed and this directory will be copied.
     *
     * SyncMode.STOP
     * The copy will be stopped and no action will be taken.
     *
     * @param {(string|Path)} intoPath
     * @param {?(boolean|function(Error))=} recursive (defaults to true)
     * @param {?(Path.SyncMode|function(Error))=} syncMode (defaults to Path.SyncMode.STOP)
     * @param {?function(Error, Path)} callback
     */
    copyDirectory: function(intoPath, recursive, syncMode, callback) {
        if (TypeUtil.isFunction(recursive)) {
            callback = recursive;
        }
        if (TypeUtil.isFunction(syncMode)) {
            callback = syncMode;
        }
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;

        var _this = this;
        var _copyPath = new Path(intoPath.getAbsolutePath() + path.sep + _this.getName());
        $series([
            $task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot copy directory '" + _this.getAbsolutePath() + "' because it does not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            $task(function(flow) {
                _this.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        if (isDirectory) {
                            flow.complete();
                        } else {
                            flow.error(new Error("Cannot perform a directory copy on '" + _this.getAbsolutePath() + "' because it is " +
                                "not a directory."));
                        }
                    } else {
                        flow.error(error);
                    }
                });
            }),
            $task(function(flow) {
                _this.ensureCopyIntoPath(intoPath, function(error) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this._copyDirectory(_copyPath, recursive, syncMode, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(error) {
            callback(error, _copyPath);
        });
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?boolean=} recursive (defaults to true)
     * @param {?Path.SyncMode=} syncMode (defaults to Path.SyncMode.STOP)
     * @return {Path}
     */
    copyDirectorySync: function(intoPath, recursive, syncMode) {
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;

        var copyPath = new Path(intoPath.getAbsolutePath() + path.sep + this.getName());
        if (!this.existsSync()) {
            throw new Error("Cannot copy directory '" + this.getAbsolutePath() + "' because it does not exist.");
        }
        if (!this.isDirectorySync()) {
            throw new Error("Cannot perform a directory copy on '" + this.getAbsolutePath() + "' because it is not a" +
                " directory");
        }
        this.ensureCopyIntoPathSync(intoPath);
        this._copyDirectorySync(copyPath, recursive, syncMode);
        return copyPath;
    },

    /**
     * Rules for DIRECTORY copy CONTENTS
     * 1) The intoPath must be a directory (or not created).
     * 2) If the intoPath exists, this function will copy the CONTENTS of this path INTO the intoPath
     * 3) If the intoPath does not exist, this function will attempt to create the intoPath and then copy the contents.
     * 4) This will not copy files recursively unless the "recursive" option is set to true.
     * @param {(string|Path)} intoPath
     * @param {?(boolean|function(Error))=} recursive (defaults to true)
     * @param {?(Path.SyncMode|function(Error))=} syncMode (defaults to Path.SyncMode.STOP)
     * @param {?function(Error)} callback
     */
    copyDirectoryContents: function(intoPath, recursive, syncMode, callback) {
        if (TypeUtil.isFunction(recursive)) {
            callback = recursive;
        }
        if (TypeUtil.isFunction(syncMode)) {
            callback = syncMode;
        }
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;

        var _this = this;
        $series([
            $task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot copy contents of directory '" + _this.getAbsolutePath() + "' " +
                            "because it does not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            $task(function(flow) {
                _this.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        if (isDirectory) {
                            flow.complete();
                        } else {
                            flow.error(new Error("Cannot perform a directory contents copy on '" +
                                _this.getAbsolutePath() + "' because it is not a directory."));
                        }
                    } else {
                        flow.error(error);
                    }
                });
            }),
            $task(function(flow) {
                _this.ensureCopyIntoPath(intoPath, function(error) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this._copyDirectoryContents(intoPath, recursive, syncMode, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?boolean=} recursive (defaults to true)
     * @param {?Path.SyncMode=} syncMode (defaults to Path.SyncMode.STOP)
     */
    copyDirectoryContentsSync: function(intoPath, recursive, syncMode) {
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;
        if (!this.existsSync()) {
            throw new Error("Cannot copy contents of directory '" + this.getAbsolutePath() + "' because it does " +
                "not exist.");
        }
        if (!this.isDirectorySync()) {
            throw new Error("Cannot perform a directory contents copy on '" + this.getAbsolutePath() +
                "' because it is not a directory.");
        }
        this.ensureCopyIntoPathSync(intoPath);
        this._copyDirectoryContentsSync(intoPath, recursive, syncMode);
    },

    //TODO BRN: add option for "preserve" See http://en.wikipedia.org/wiki/Cp_(Unix) for description.
    /**
     * Rules for FILE copy
     * 1) If the intoPath does not exist, this function will attempt to create the directory path.
     * 2) If the intoPath exists, this file will be copied INTO the existing path.
     * 3) The copyFile function will look in to the intoPath for a path by this file's name.
     * 4a) If the path does not exist, the file will be created and this file's contents will be copied in to the new
     * file.
     * 4b) If the path does exist, the fileCopy function will take one of the following actions based upon the SyncMode.
     *
     * SyncMode.MERGE_REPLACE
     * If the Path is a directory, the directory will be removed and this file will be copied.
     * If the Path is a file, the file's contents will be replace with this file's contents.
     *
     * SyncMode.MERGE_STOP
     * If the Path is a directory, this file will not be copied.
     * If the Path is a file, the file will be left alone and this file will not be copied.
     *
     * SyncMode.REPLACE
     * If the Path is a directory, it will be removed and this file will be copied.
     * If the Path is a file, it will be removed, a new file will be created, and this file's contents will be copied
     * to the new file.
     *
     * SyncMode.STOP
     * The copy will be stopped and no action will be taken.
     *
     * @param {(string|Path)} intoPath
     * @param {?(Path.SyncMode|function(Error))=} syncMode (defaults to Path.SyncMode.STOP)
     * @param {?function(Error, Path)} callback
     */
    copyFile: function(intoPath, syncMode, callback) {
        if (TypeUtil.isFunction(syncMode)) {
            callback = syncMode;
        }
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;

        var _this = this;
        var _copyPath = new Path(intoPath.getAbsolutePath() + path.sep + this.getName());
        $series([
            $task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot copy file '" + _this.getAbsolutePath() + "' because it does " +
                            "not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            $task(function(flow) {
                _this.isFile(function(error, isFile) {
                    if (!error) {
                        if (isFile) {
                            flow.complete();
                        } else {
                            flow.error("Cannot perform a file copy on '" + _this.getAbsolutePath() + "' because it " +
                                "is not a file.");
                        }
                    } else {
                        flow.error(error);
                    }
                });
            }),
            $task(function(flow) {
                _this.ensureCopyIntoPath(intoPath, function(error) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this._copyFile(_copyPath, syncMode, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(error) {
            if (!error) {
                callback(error, _copyPath);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?Path.SyncMode=} syncMode (defaults to Path.SyncMode.STOP)
     * @return {Path}
     */
    copyFileSync: function(intoPath, syncMode) {
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;

        var copyPath = new Path(intoPath.getAbsolutePath() + path.sep + this.getName());
        if (!this.existsSync()) {
            throw new Error("Cannot copy file '" + this.getAbsolutePath() + "' because it does not exist.");
        }
        if (!this.isFileSync()) {
            throw new Error("Cannot perform a file copy on '" + this.getAbsolutePath() + "' because it is not " +
                "a file.");
        }
        this.ensureCopyIntoPathSync(intoPath);
        this._copyFileSync(copyPath, syncMode);
        return copyPath;
    },

    /**
     * Rules for createDirectory
     * 1) If the directory already exists, it is NOT MODIFIED
     * @param {?(boolean|function(Error))=} createParentDirectories (defaults to true)
     * @param {?(string|function(Error))=} mode (defaults to '0777')
     * @param {?function(Error, Path)} callback
     */
    createDirectory: function(createParentDirectories, mode, callback) {
        if (TypeUtil.isFunction(createParentDirectories)) {
            callback = createParentDirectories;
        }
        if (TypeUtil.isFunction(mode)) {
            callback = mode;
        }
        createParentDirectories = TypeUtil.isBoolean(createParentDirectories) ? createParentDirectories : true;
        mode = TypeUtil.isString(mode) ? mode : '0777';

        var _this = this;
        $if (function(flow) {
                _this.exists(function(exists) {
                    flow.assert(!exists);
                });
            },
            $task(function(flow) {
                _this._createDirectory(createParentDirectories, mode, function(error) {
                    flow.complete(error);
                });
            })
        ).$else(
            $task(function(flow) {

                // NOTE BRN: We check this to make sure that the given path did not exist already as a file.

                _this.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        if (!isDirectory) {
                            flow.error(new Error("Could not create directory '" + _this.getAbsolutePath() +
                                "' because it already exists and is not a directory."));
                        } else {
                            flow.complete();
                        }
                    } else {
                        flow.error(error);
                    }
                });
            })
        ).execute(function(error) {
            if (!error) {
                callback(null, this);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {?boolean=} createParentDirectories
     * @param {?string=} mode
     * @return {Path}
     */
    createDirectorySync: function(createParentDirectories, mode) {
        createParentDirectories = TypeUtil.isBoolean(createParentDirectories) ? createParentDirectories : true;
        mode = TypeUtil.isString(mode) ? mode : '0777';

        if (!this.existsSync()) {
            this._createDirectorySync(createParentDirectories, mode);
        } else if (!this.isDirectorySync()) {
            throw new Error("Could not create directory '" + this.getAbsolutePath() + "' because it already exists " +
                "and is not a directory.");
        }
        return this;
    },

    /**
     * Rules for createFile
     * 1) If the file already exists, it is NOT MODIFIED.
     * 2) If the path already exists and it is not a file, the function will throw an error.
     * @param {?(boolean|function(Error))=} createParentDirectories (defaults to true)
     * @param {?function(Error, Path)} callback
     */
    createFile: function(createParentDirectories, callback) {
        if (TypeUtil.isFunction(createParentDirectories)) {
            callback = createParentDirectories;
        }
        createParentDirectories = TypeUtil.isBoolean(createParentDirectories) ? createParentDirectories : true;

        var _this = this;
        $if (function(flow) {
                _this.exists(function(exists) {
                    flow.assert(!exists);
                });
            },
            $task(function(flow) {
                _this._createFile(createParentDirectories, function(error) {
                    flow.complete(error);
                });
            })
        ).$else(
            // NOTE BRN: We check this to make sure that the given path did not exist already as a file.
            $task(function(flow) {
                _this.isFile(function(error, isFile) {
                    if (!error) {
                        if (!isFile) {
                            flow.error(new Error("Could not create file '" + _this.getAbsolutePath() +
                                "' because it already exists and is not a file."));
                        } else {
                            flow.complete();
                        }
                    } else {
                        flow.error(error);
                    }
                });
            })
        ).execute(function(error) {
            if (!error) {
                callback(null, this);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {?boolean=} createParentDirectories (defaults to true)
     */
    createFileSync: function(createParentDirectories) {
        createParentDirectories = TypeUtil.isBoolean(createParentDirectories) ? createParentDirectories : true;
        if (!this.existsSync()) {
            this._createFileSync(createParentDirectories);
        } else if (!this.isFileSync()) {
            throw new Error("Could not create file '" + this.getAbsolutePath() + "' because it already exists " +
                "and is not a file.");
        }
        return this;
    },

    /**
     * @param {Object} options
     * @return {ReadStream}
     */
    createReadStream: function(options) {
        return fs.createReadStream(this.getAbsolutePath(), options);
    },

    /**
     * @param {Object} options
     * @return {WriteStream}
     */
    createWriteStream: function(options) {
        return fs.createWriteStream(this.getAbsolutePath(), options);
    },

    /**
     * @param {?(boolean|function(Error))=} recursive
     * @param {?function(Error)} callback
     */
    delete: function(recursive, callback) {
        if (TypeUtil.isFunction(recursive)) {
            callback = recursive;
        }
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;

        var _this = this;
        $if (function(flow) {
                _this.exists(function(exists) {
                    flow.assert(exists);
                });
            },
            $task(function(flow) {
                _this._delete(recursive, function(error) {
                    flow.complete(error);
                });
            })
        ).execute(callback);
    },

    /**
     * @param {?boolean=} recursive
     */
    deleteSync: function(recursive) {
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;
        if (this.existsSync()) {
            this._deleteSync(recursive);
        }
    },

    /**
     * @param {?(boolean|function(Error))=} recursive (defaults to true)
     * @param {?function(Error)} callback
     */
    deleteDirectory: function(recursive, callback) {
        if (TypeUtil.isFunction(recursive)) {
            callback = recursive;
        }
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;

        var _this = this;
        $if (function(flow) {
                _this.exists(function(exists) {
                    flow.assert(exists);
                });
            },
            $series([
                $task(function(flow) {
                    _this.isDirectory(function(error, isDirectory) {
                        if (!error) {
                            if (isDirectory) {
                                flow.complete();
                            } else {
                                flow.error(new Error("Cannot perform a directory delete on '" + _this.getAbsolutePath() +
                                    "' because it is not a directory."));
                            }
                        } else {
                            flow.error(error);
                        }
                    });
                }),
                $task(function(flow) {
                    _this._deleteDirectory(recursive, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).execute(callback);
    },

    /**
     * @param {?boolean=} recursive
     */
    deleteDirectorySync: function(recursive) {
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;
        if (this.existsSync()) {
            if (!this.isDirectorySync()) {
                throw new Error("Cannot perform a directory delete on '" + this.getAbsolutePath() +
                    "' because it is not a directory.")
            }
            this._deleteDirectorySync(recursive);
        }
    },

    /**
     * @param {?function(Error)} callback
     */
    deleteFile: function(callback) {
        var _this = this;
        $if (function(flow) {
                _this.exists(function(exists) {
                    flow.assert(exists);
                });
            },
            $series([
                $task(function(flow) {
                    _this.isFile(function(error, isFile) {
                        if (!error) {
                            if (isFile) {
                                flow.complete();
                            } else {
                                flow.error("Cannot perform a file delete on '" + _this.getAbsolutePath() + "' because it " +
                                    "is not a file.");
                            }
                        } else {
                            flow.error(error);
                        }
                    });
                }),
                $task(function(flow) {
                    _this._deleteFile(function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).execute(callback);
    },

    /**
     *
     */
    deleteFileSync: function() {
        if (this.existsSync()) {
            if (!this.isFileSync()) {
                throw new Error("Cannot perform a file delete on '" + this.getAbsolutePath() + "' because it is not " +
                    "a file.");
            }
            this._deleteFileSync();
        }
    },

    /**
     * @param {function(boolean)} callback
     */
    exists: function(callback) {
        fs.exists(this.getAbsolutePath(), callback);
    },

    /**
     * @return {boolean}
     */
    existsSync: function() {
        return fs.existsSync(this.getAbsolutePath());
    },

    //TODO BRN: Should this return false if the path does not exist, or should it throw an error like it does now?
    /**
     * @param {function(Error, boolean)} callback
     */
    isDirectory: function(callback) {
        fs.lstat(this.getAbsolutePath(), function(error, stats) {
            if (error) {
                callback(new Error(error.message), false);
            } else {
                callback(null, stats.isDirectory());
            }
        });
    },

    //TODO BRN: Should this return false if the path does not exist, or should it throw an error like it does now?
    /**
     * @return {boolean}
     */
    isDirectorySync: function() {
        var stats = fs.lstatSync(this.getAbsolutePath());
        return stats.isDirectory();
    },

    /**
     * @param {function(Error, boolean)} callback
     */
    isDirectoryEmpty: function(callback) {
        var _this = this;
        var _isEmpty = null;
        $series([
            $task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot check if directory '" + _this.getAbsolutePath() + "' is empty because it " +
                            "does not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            $task(function(flow) {
                _this.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        if (isDirectory) {
                            flow.complete();
                        } else {
                            flow.error(new Error("Cannot perform an empty directory check on '" + _this.getAbsolutePath() +
                                "' because it is not a directory."));
                        }
                    } else {
                        flow.error(error);
                    }
                });
            }),
            $task(function(flow) {
                _this._isDirectoryEmpty(function(error, isEmpty) {
                    if (!error) {
                        _isEmpty = isEmpty;
                        flow.complete();
                    } else {
                        flow.error(error);
                    }
                });
            })
        ]).execute(function(error) {
            callback(error, _isEmpty);
        });
    },

    /**
     * @return {boolean}
     */
    isDirectoryEmptySync: function() {
        if (!this.existsSync()) {
            throw new Error("Cannot check if directory '" + this.getAbsolutePath() + "' is empty because it does " +
                "not exist.");
        }
        if (!this.isDirectorySync()) {
            throw new Error("Cannot perform an empty directory check on '" + this.getAbsolutePath() +
                "' because it is not a directory.");
        }
        return this._isDirectoryEmptySync();
    },

    //TODO BRN: Should this return false if the path does not exist, or should it throw an error like it does now?
    /**
     * @param {function(Error, boolean)} callback
     */
    isFile: function(callback) {
        fs.lstat(this.absolutePath, function(error, stats) {
            if (error) {
                callback(new Error(error.message), false);
            } else {
                callback(null, stats.isFile());
            }
        });
    },

    //TODO BRN: Should this return false if the path does not exist, or should it throw an error like it does now?
    /**
     * @return {boolean}
     */
    isFileSync: function() {
        var stats = fs.lstatSync(this.getAbsolutePath());
        return stats.isFile();
    },

    /**
     * @param {function(Error, boolean)} callback
     */
    isSymbolicLink: function(callback) {
        fs.lstat(this.absolutePath, function(error, stats) {
            if (error) {
                callback(new Error(error.message), false);
            } else {
                callback(null, stats.isSymbolicLink());
            }
        });
    },

    /**
     * @return {boolean}
     */
    isSymbolicLinkSync: function() {
        var stats = fs.lstatSync(this.getAbsolutePath());
        return stats.isSymbolicLink();
    },

    //TODO BRN: Handle the case where a move is across a network or through a symlink
    /**
     * @param {(string|Path)} intoPath
     * @param {?(Path.SyncMode|function(Error))=} syncMode (defaults to Path.SyncMode.STOP)
     * @param {?function(Error)} callback
     */
    move: function(intoPath, syncMode, callback) {
        if (TypeUtil.isFunction(syncMode)) {
            callback = syncMode;
        }
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;

        var _this = this;
        var _movePath = new Path(intoPath.getAbsolutePath() + path.sep + this.getName());
        $series([
            $task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot move path '" + _this.getAbsolutePath() + "' because it does " +
                            "not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            $task(function(flow) {
                _this.ensureCopyIntoPath(intoPath, function(error) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this._move(_movePath, syncMode, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(error) {
            if (!error) {
                callback(error, _movePath);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?Path.SyncMode=} syncMode
     * @return {Path}
     */
    moveSync: function(intoPath, syncMode) {
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;

        var movePath = new Path(intoPath.getAbsolutePath() + path.sep + this.getName());
        if (!this.existsSync()) {
            throw new Error("Cannot move path '" + this.getAbsolutePath() + "' because it does not exist.")
        }
        this.ensureCopyIntoPathSync(intoPath);
        this._moveSync(movePath, syncMode);
        return movePath;
    },

    /**
     * Rules for DIRECTORY move
     * 1) The intoPath must be a directory (or not created).
     * 2) If the intoPath does not exist, this function will attempt to create the intoPath.
     * 3) This function will look in the intoPath for a directory by the name of this directory
     * 3a) If a directory by the name of this one exists and overwrite is true, it will attempt to merge this directory's
     * contents with that one
     * 3b) If a directory by the name of this one exists and overwrite is false, it will not attempt a move.
     * 3c) If a directory by the name of this one does NOT exist, it will create a directory with this name. The
     * directory's contents will then be moved in to the newly created directory.
     * 6) This will not copy files recursively unless the "recursive" option is set to true.
     * @param {(string|Path)} intoPath
     * @param {?(Path.SyncMode|function(Error))=} syncMode (defaults to Path.SyncMode.STOP)
     * @param {?function(Error, Path)} callback
     */
    moveDirectory: function(intoPath, syncMode, callback) {
        if (TypeUtil.isFunction(syncMode)) {
            callback = syncMode;
        }
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;

        var _this = this;
        var _movePath = new Path(intoPath.getAbsolutePath() + path.sep + this.getName());
        $series([
            $task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot move directory '" + _this.getAbsolutePath() + "' because it " +
                            "does not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            $task(function(flow) {
                _this.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        if (isDirectory) {
                            flow.complete();
                        } else {
                            flow.error(new Error("Cannot perform a directory move on '" + _this.getAbsolutePath() +
                                "' because it is not a directory."));
                        }
                    } else {
                        flow.error(error);
                    }
                });
            }),
            $task(function(flow) {
                _this.ensureCopyIntoPath(intoPath, function(error) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this._moveDirectory(intoPath, syncMode, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(error) {
            if (!error) {
                callback(error, _movePath);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?Path.SyncMode=} syncMode
     * @return {Path}
     */
    moveDirectorySync: function(intoPath, syncMode) {
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;

        var movePath = new Path(intoPath.getAbsolutePath() + path.sep + this.getName());
        if (!this.existsSync()) {
            throw new Error("Cannot move directory '" + this.getAbsolutePath() + "' because it does not exist.");
        }
        if (!this.isDirectorySync()) {
            throw new Error("Cannot perform a directory move on '" + this.getAbsolutePath() + "' because it is not a" +
                " directory");
        }
        this.ensureCopyIntoPathSync(intoPath);
        this._moveDirectorySync(movePath, syncMode);
        return movePath;
    },

    /**
     * Rules for DIRECTORY move CONTENTS
     * 1) The intoPath must be a directory (or not created).
     * 2) If the intoPath exists, this function will move the CONTENTS of this path INTO the intoPath
     * 3) If the intoPath does not exist, this function will attempt to create the intoPath and then move the contents.
     * 4) This will always move files recursively
     * @param {(string|Path)} intoPath
     * @param {?(Path.SyncMode|function(Error))=} syncMode (defaults to Path.SyncMode)
     * @param {?function(Error)} callback
     */
    moveDirectoryContents: function(intoPath, syncMode, callback) {
        if (TypeUtil.isFunction(syncMode)) {
            callback = syncMode;
        }
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;

        var _this = this;
        $series([
            $task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot move contents of directory '" + _this.getAbsolutePath() + "' " +
                            "because it does not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            $task(function(flow) {
                _this.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        if (isDirectory) {
                            flow.complete();
                        } else {
                            flow.error(new Error("Cannot perform a directory contents move on '" +
                                _this.getAbsolutePath() + "' because it is not a directory."));
                        }
                    } else {
                        flow.error(error);
                    }
                });
            }),
            $task(function(flow) {
                _this.ensureCopyIntoPath(intoPath, function(error) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this._moveDirectoryContents(intoPath, syncMode, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?Path.SyncMode=} syncMode (defaults to Path.SyncMode.STOP)
     */
    moveDirectoryContentsSync: function(intoPath, syncMode) {
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;
        if (!this.existsSync()) {
            throw new Error("Cannot move contents of directory '" + this.getAbsolutePath() + "' because it does " +
                "not exist.");
        }
        if (!this.isDirectorySync()) {
            throw new Error("Cannot perform a directory contents move on '" + this.getAbsolutePath() +
                "' because it is not a directory.")
        }
        this.ensureCopyIntoPathSync(intoPath);
        this._moveDirectoryContentsSync(intoPath, syncMode);
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?(Path.SyncMode|function(Error))=} syncMode (defaults to false)
     * @param {?function(Error, Path)} callback
     */
    moveFile: function(intoPath, syncMode, callback) {
        if (TypeUtil.isFunction(syncMode)) {
            callback = syncMode;
        }
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;

        var _this = this;
        var _movePath = new Path(intoPath.getAbsolutePath() + path.sep + this.getName());
        $series([
            $task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot move file '" + _this.getAbsolutePath() + "' because it does " +
                            "not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            $task(function(flow) {
                _this.isFile(function(error, isFile) {
                    if (!error) {
                        if (isFile) {
                            flow.complete();
                        } else {
                            flow.error(new Error("Cannot perform a file move on '" + _this.getAbsolutePath() + "' because it " +
                                "is not a file."));
                        }
                    } else {
                        flow.error(error);
                    }
                });
            }),
            $task(function(flow) {
                _this.ensureCopyIntoPath(intoPath, function(error) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this._moveFile(_movePath, syncMode, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(error) {
            if (!error) {
                callback(error, _movePath);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?Path.SyncMode=} syncMode (defaults to Path.SyncMode.STOP)
     * @return {Path}
     */
    moveFileSync: function(intoPath, syncMode) {
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        syncMode = TypeUtil.isString(syncMode) ? syncMode : Path.SyncMode.STOP;

        var movePath = new Path(intoPath.getAbsolutePath() + path.sep + this.getName());
        if (!this.existsSync()) {
            throw new Error("Cannot move file '" + this.getAbsolutePath() + "' because it does" +
                "not exist.");
        }
        if (!this.isFileSync()) {
             throw new Error("Cannot perform a file move on '" + this.getAbsolutePath() + "' because it " +
                 "is not a file.");
        }
        this.ensureCopyIntoPathSync(intoPath);
        this._moveFileSync(movePath, syncMode);
        return movePath;
    },

    /**
     * @param {?function(Error, Array<Path>)} callback
     */
    readDirectory: function(callback) {
        var _this = this;
        var dirPaths = null;
        $series([
            $task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot read directory '" + _this.getAbsolutePath() + "' because it " +
                            "does not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            $task(function(flow) {
                _this.isDirectory(function(error, isFile) {
                    if (!error) {
                        if (isFile) {
                            flow.complete();
                        } else {
                            flow.error("Cannot read directory '" + _this.getAbsolutePath() + "' because it " +
                                "is not a directory.");
                        }
                    } else {
                        flow.error(error);
                    }
                });
            }),
            $task(function(flow) {
                _this._readDirectory(function(error, _dirPaths) {
                    dirPaths = _dirPaths;
                    flow.complete(error);
                });
            })
        ]).execute(callback);

    },

    /**
     * @return {Array<Path>}
     */
    readDirectorySync: function() {
        if (this.existsSync()) {
            if (this.isDirectorySync()) {
                return this._readDirectorySync();
            } else {
                throw new Error("Cannot read directory '" + this.getAbsolutePath() + "' because it is not a " +
                    "directory.");
            }
        } else {
            throw new Error("Cannot ready directory '" + this.getAbsolutePath() + "' because it does not exist.");
        }
    },

    /**
     * @param {string} data
     * @param {?(string|function(Error))=} encoding (defaults to 'utf8')
     * @param {?function(Error)} callback
     */
    writeFile: function(data, encoding, callback) {
        if (TypeUtil.isFunction(encoding)) {
            callback = encoding;
            encoding = 'utf8';
        }
        encoding = TypeUtil.isString(encoding) ? encoding : 'utf8';
        this._writeFile(data, encoding, callback);
    },

    /**
     * @param {string} data
     * @param {?string} encoding
     */
    writeFileSync: function(data, encoding) {
        encoding = TypeUtil.isString(encoding) ? encoding : 'utf8';
        this._writeFileSync(data, encoding);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Path} copyPath
     * @param {boolean} recursive (defaults to true)
     * @param {Path.SyncMode} syncMode (defaults to Path.SyncMode.STOP)
     * @param {?function(Error)} callback
     */
    _copy: function(copyPath, recursive, syncMode, callback) {
        var _this = this;
        $if (function(flow) {
                _this.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        flow.assert(isDirectory);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $task(function(flow) {
                _this._copyDirectory(copyPath, recursive, syncMode, function(error) {
                    flow.complete(error);
                });
            })
        ).$elseIf (function(flow) {
                _this.isFile(function(error, isFile) {
                    if (!error) {
                        flow.assert(isFile);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $task(function(flow) {
                _this._copyFile(copyPath, syncMode, function(error) {
                    flow.complete(error);
                });
            })
        ).$else (
            $task(function(flow) {
                flow.error(new Error("Cannot copy path '" + _this.getAbsolutePath() + "' because it is an " +
                    "unknown type."));
            })
        ).execute(callback);
    },

    /**
     * @private
     * @param {Path} copyPath
     * @param {boolean} recursive
     * @param {Path.SyncMode} syncMode
     */
    _copySync: function(copyPath, recursive, syncMode) {
        if (this.isDirectorySync()) {
            this._copyDirectorySync(copyPath, recursive, syncMode);
        } else if (this.isFileSync()) {
            this._copyFileSync(copyPath, syncMode);
        } else {
            throw new Error("Cannot copy path '" + this.getAbsolutePath() + "' because it is an unknown type.");
        }
    },

    /**
     * @private
     * @param {Path} copyPath
     * @param {boolean} recursive
     * @param {Path.SyncMode} syncMode
     * @param {?function(Error)} callback
     */
    _copyDirectory: function(copyPath, recursive, syncMode, callback) {

        //TODO BRN: Add support for limiting the number of open file handles. Checkout ncp module https://github.com/AvianFlu/ncp/blob/master/lib/ncp.js
        /*if (running >= limit) {
         return process.nextTick(function () {
         getStats(source);
         });
         }*/

        var _this = this;
        $if (function(flow) {
                copyPath.exists(function(exists) {
                    flow.assert(exists);
                });
            },
            $task(function(flow) {
                switch (syncMode) {
                    case Path.SyncMode.MERGE_REPLACE:
                        _this._copyDirectoryMergeReplace(copyPath, recursive, syncMode, function(error) {
                            flow.complete(error);
                        });
                        break;
                    case Path.SyncMode.MERGE_STOP:
                        _this._copyDirectoryMergeStop(copyPath, recursive, syncMode, function(error) {
                            flow.complete(error);
                        });
                        break;
                    case Path.SyncMode.REPLACE:
                        _this._copyDirectoryReplace(copyPath, recursive, syncMode, function(error) {
                            flow.complete(error);
                        });
                        break;
                    default:
                        flow.complete();
                }
            })
        ).$else(
            $task(function(flow) {
                copyPath._createDirectory(true, "0777", function(error) {
                    if (!error) {
                        _this._copyDirectoryContents(copyPath, true, "0777", function(error) {
                            flow.complete(error);
                        });
                    } else {
                        flow.error(error);
                    }
                });
            })
        ).execute(callback);
    },

    /**
     * @private
     * @param {Path} copyPath
     * @param {boolean} recursive
     * @param {Path.SyncMode} syncMode
     */
    _copyDirectorySync: function(copyPath, recursive, syncMode) {
        var copyPathExists = copyPath.existsSync();
        if (!copyPathExists) {
            copyPath._createDirectorySync(true, "0777");
            this._copyDirectoryContentsSync(copyPath, recursive, syncMode);
        } else {

            //NOTE BRN: Do nothing in the STOP case

            switch (syncMode) {
                case Path.SyncMode.MERGE_REPLACE:
                    this._copyDirectoryMergeReplaceSync(copyPath, recursive, syncMode);
                    break;
                case Path.SyncMode.MERGE_STOP:
                    this._copyDirectoryMergeStopSync(copyPath, recursive, syncMode);
                    break;
                case Path.SyncMode.REPLACE:
                    this._copyDirectoryReplaceSync(copyPath, recursive, syncMode);
                    break;
            }
        }
    },

    /**
     * @private
     * @param {Path} copyPath
     * @param {boolean} recursive
     * @param {Path.SyncMode} syncMode
     * @param {?function(Error)} callback
     */
    _copyDirectoryMergeReplace: function(copyPath, recursive, syncMode, callback) {
        var _this = this;
        $if (function(flow) {
                copyPath.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        flow.assert(isDirectory);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $task(function(flow) {
                _this._copyDirectoryContents(copyPath, recursive, syncMode, function(error) {
                    flow.complete(error);
                });
            })
        ).$elseIf(function(flow) {
                copyPath.isFile(function(error, isFile) {
                    if (!error) {
                        flow.assert(isFile);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $series([
                $task(function(flow) {
                    copyPath._deleteFile(function(error) {
                        flow.complete(error);
                    })
                }),
                $task(function(flow) {
                    copyPath._createDirectory(true, "0777", function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._copyDirectoryContents(copyPath, recursive, syncMode, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).execute(callback);
    },

    /**
     * @private
     * @param {Path} copyPath
     * @param {boolean} recursive
     * @param {Path.SyncMode} syncMode
     */
    _copyDirectoryMergeReplaceSync: function(copyPath, recursive, syncMode) {

        //NOTE BRN: Do nothing if we don't recognize the type (symlink)

        if (copyPath.isDirectorySync()) {
            this._copyDirectoryContentsSync(copyPath, recursive, syncMode);
        } else if (copyPath.isFileSync()) {
            copyPath._deleteFileSync();
            copyPath._createDirectorySync(true, "0777");
            this._copyDirectoryContentsSync(copyPath, recursive, syncMode);
        }
    },

    /**
     * @private
     * @param {Path} copyPath
     * @param {boolean} recursive
     * @param {Path.SyncMode} syncMode
     * @param {?function(Error)} callback
     */
    _copyDirectoryMergeStop: function(copyPath, recursive, syncMode, callback) {
        var _this = this;
        copyPath.isDirectory(function(error, isDirectory) {
            if (!error) {
                if (isDirectory) {
                    _this._copyDirectoryContents(copyPath, recursive, syncMode, callback);
                } else {
                    callback();
                }
            } else {
                callback(error);
            }
        });
    },

    /**
     * @private
     * @param {Path} copyPath
     * @param {boolean} recursive
     * @param {Path.SyncMode} syncMode
     */
    _copyDirectoryMergeStopSync: function(copyPath, recursive, syncMode) {

        //NOTE BRN: Do nothing if the copyPath is a file we don't recognize the type (symlink)

        if (copyPath.isDirectorySync()) {
            this._copyDirectoryContentsSync(copyPath, recursive, syncMode);
        }
    },

    /**
     * @private
     * @param {Path} copyPath
     * @param {boolean} recursive
     * @param {Path.SyncMode} syncMode
     * @param {?function(Error)} callback
     */
    _copyDirectoryReplace: function(copyPath, recursive, syncMode, callback) {
        var _this = this;
        $if (function(flow) {
                copyPath.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        flow.assert(isDirectory);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $series([
                $task(function(flow) {
                    copyPath._deleteDirectory(true, function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    copyPath._createDirectory(true, "0777", function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._copyDirectoryContents(copyPath, recursive, syncMode, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).$elseIf(function(flow) {
                copyPath.isFile(function(error, isFile) {
                    if (!error) {
                        flow.assert(isFile);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $series([
                $task(function(flow) {
                    copyPath._deleteFile(function(error) {
                        flow.complete(error);
                    })
                }),
                $task(function(flow) {
                    copyPath._createDirectory(true, "0777", function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._copyDirectoryContents(copyPath, recursive, syncMode, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).execute(callback);
    },

    /**
     * @private
     * @param {Path} copyPath
     * @param {boolean} recursive
     * @param {Path.SyncMode} syncMode
     */
    _copyDirectoryReplaceSync: function(copyPath, recursive, syncMode) {

        //NOTE BRN: Do nothing if we don't recognize the type (symlink)

        if (copyPath.isDirectorySync()) {
            copyPath._deleteDirectorySync(true);
            copyPath._createDirectorySync(true, "0777");
            this._copyDirectoryContentsSync(copyPath, recursive, syncMode);
        } else if (copyPath.isFileSync()) {
            copyPath._deleteFileSync();
            copyPath._createDirectorySync(true, "0777");
            this._copyDirectoryContentsSync(copyPath, recursive, syncMode);
        }
    },

    /**
     * @private
     * @param {Path} intoPath
     * @param {boolean} recursive
     * @param {Path.SyncMode} syncMode
     * @param {?function(Error)} callback
     */
    _copyDirectoryContents: function(intoPath, recursive, syncMode, callback) {
        //TODO BRN: Add support for limiting the number of open file handles. Checkout ncp module https://github.com/AvianFlu/ncp/blob/master/lib/ncp.js
        var _this = this;
        var childPathArray = [];
        $series([
            $task(function(flow) {
                _this._readDirectory(function(error, pathArray) {
                    if (!error) {
                        childPathArray = pathArray;
                        flow.complete();
                    } else {
                        flow.error(error);
                    }
                });
            }),
            $task(function(flow) {
                $foreach(childPathArray, function(boil, childPath) {
                    var copyPath = new Path(intoPath.getAbsolutePath() + path.sep + childPath.getName());
                    childPath.isDirectory(function(error, isDirectory) {
                        if (!error) {
                            if (isDirectory) {
                                if (recursive) {
                                    childPath._copyDirectory(copyPath, recursive, syncMode, function(error) {
                                        boil.bubble(error);
                                    });
                                } else {
                                    boil.bubble();
                                }
                            } else {
                                childPath.isFile(function(error, isFile) {
                                    if (!error) {
                                        if (isFile) {
                                            childPath._copyFile(copyPath, syncMode, function(error) {
                                                boil.bubble(error);
                                            });
                                        } else {

                                            // NOTE BRN: Don't touch it if we don't recognize it/

                                            boil.bubble();
                                        }
                                    } else {
                                        boil.bubble(error);
                                    }
                                });
                            }
                        } else {
                            boil.bubble(error);
                        }
                    });
                }).execute(function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },

    /**
     * @private
     * @param {Path} intoPath
     * @param {boolean} recursive
     * @param {Path.SyncMode} syncMode
     */
    _copyDirectoryContentsSync: function(intoPath, recursive, syncMode) {
        var childPathArray = this._readDirectorySync();
        childPathArray.forEach(function(childPath) {
            var copyPath = new Path(intoPath.getAbsolutePath() + path.sep + childPath.getName());
            if (childPath.isDirectorySync() && recursive) {
                childPath._copyDirectorySync(copyPath, recursive, syncMode);
            } else if (childPath.isFileSync()) {
                childPath._copyFileSync(copyPath, syncMode);
            }
        });
    },

    //TODO BRN: add option for "preserve" See http://en.wikipedia.org/wiki/Cp_(Unix) for description.
    /**
     * @private
     * @param {Path} copyPath
     * @param {Path.SyncMode} syncMode
     * @param {?function(Error)} callback
     */
    _copyFile: function(copyPath, syncMode, callback) {

        //TODO BRN: Add support for limiting the number of open file handles. Checkout ncp module https://github.com/AvianFlu/ncp/blob/master/lib/ncp.js
        var _this = this;
        $if (function(flow) {
                copyPath.exists(function(exists) {
                    flow.assert(exists);
                });
            },
            $task(function(flow) {
                switch (syncMode) {
                    case Path.SyncMode.MERGE_REPLACE:
                        _this._copyFileMergeReplace(copyPath, function(error) {
                            flow.complete(error);
                        });
                        break;
                    case Path.SyncMode.REPLACE:
                        _this._copyFileReplace(copyPath, function(error) {
                            flow.complete(error);
                        });
                        break;
                    default:
                        flow.complete();
                }
            })
        ).$else(
            $series([
                $task(function(flow) {
                    copyPath._createFile(false, function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._copyFileContents(copyPath, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).execute(callback);
    },

    /**
     * @private
     * @param {Path} copyPath
     * @param {Path.SyncMode} syncMode
     */
    _copyFileSync: function(copyPath, syncMode) {
        var exists = copyPath.existsSync();
        if (!exists) {
            copyPath._createFileSync(false);
            this._copyFileContentsSync(copyPath);
        } else {

            //NOTE BRN: Do nothing in the STOP case AND the MERGE_STOP

            switch (syncMode) {
                case Path.SyncMode.MERGE_REPLACE:
                    this._copyFileMergeReplaceSync(copyPath);
                    break;
                case Path.SyncMode.REPLACE:
                    this._copyFileReplaceSync(copyPath);
                    break;
            }
        }
    },

    /**
     * @private
     * @param {Path} copyPath
     * @param {?function(Error)} callback
     */
    _copyFileMergeReplace: function(copyPath, callback) {
        var _this = this;
        $if (function(flow) {
                copyPath.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        flow.assert(isDirectory);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $series([
                $task(function(flow) {
                    copyPath._deleteDirectory(true, function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    copyPath._createFile(false, function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._copyFileContents(copyPath, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).$elseIf(function(flow) {
                copyPath.isFile(function(error, isFile) {
                    if (!error) {
                        flow.assert(isFile);
                    } else {
                        flow.error(error);
                    }
                })
            },
            $task(function(flow) {
                _this._copyFileContents(copyPath, function(error) {
                    flow.complete(error);
                });
            })
        ).execute(callback);
    },

    /**
     * @private
     * @param {Path} copyPath
     */
    _copyFileMergeReplaceSync: function(copyPath) {

        //NOTE BRN: Do nothing if we don't recognize the type (symlink)

        if (copyPath.isDirectorySync()) {
            copyPath._deleteDirectorySync(true);
            copyPath._createFileSync(false);
            this._copyFileContentsSync(copyPath);
        } else if (copyPath.isFileSync()) {
            this._copyFileContentsSync(copyPath);
        }
    },

    /**
     * @private
     * @param {Path} copyPath
     * @param {?function(Error)} callback
     */
    _copyFileReplace: function(copyPath, callback) {
        var _this = this;
        $if (function(flow) {
                copyPath.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        flow.assert(isDirectory);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $series([
                $task(function(flow) {
                    copyPath._deleteDirectory(true, function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    copyPath._createFile(false, function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._copyFileContents(copyPath, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).$elseIf(function(flow) {
                copyPath.isFile(function(error, isFile) {
                    if (!error) {
                        flow.assert(isFile);
                    } else {
                        flow.error(error);
                    }
                })
            },
            $series([
                $task(function(flow) {
                    copyPath._deleteFile(function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    copyPath._createFile(false, function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._copyFileContents(copyPath, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).execute(callback);
    },

    /**
     * @private
     * @param {Path} copyPath
     */
    _copyFileReplaceSync: function(copyPath) {

        //NOTE BRN: Do nothing if we don't recognize the type (symlink)

        if (copyPath.isDirectorySync()) {
            copyPath._deleteDirectorySync(true);
            copyPath._createFileSync(false);
            this._copyFileContentsSync(copyPath);
        } else if (copyPath.isFileSync()) {
            copyPath._deleteFileSync();
            copyPath._createFileSync(false);
            this._copyFileContentsSync(copyPath);
        }
    },

    /**
     * @private
     * @param {Path} copyPath
     * @param {?function(Error)} callback
     */
    _copyFileContents: function(copyPath, callback) {
        var readStream = this.createReadStream();
        var writeStream = copyPath.createWriteStream();
        readStream.pipe(writeStream);
        readStream.on('end', function() {
            readStream.removeAllListeners();
            writeStream.removeAllListeners();
            if (callback) {
                callback();
            }
        });
        readStream.on('error', function(error) {
            readStream.removeAllListeners();
            writeStream.removeAllListeners();
            if (callback) {
                callback(error);
            }
        });
        writeStream.on('error', function(error) {
            readStream.removeAllListeners();
            writeStream.removeAllListeners();
            if (callback) {
                callback(error);
            }
        });
    },

    /**
     * @private
     * @param {Path} copyPath
     */
    _copyFileContentsSync: function(copyPath) {
        var BUF_LENGTH = 64 * 1024;
        var buffer = new Buffer(BUF_LENGTH);
        var fdRead = fs.openSync(this.getAbsolutePath(), 'r');
        var fdWrite = fs.openSync(copyPath.getAbsolutePath(), 'w');
        var bytesRead = 1;
        var position = 0;
        while (bytesRead > 0) {
            bytesRead = fs.readSync(fdRead, buffer, 0, BUF_LENGTH, position);
            fs.writeSync(fdWrite, buffer, 0, bytesRead);
            position += bytesRead;
        }
        fs.closeSync(fdRead);
        fs.closeSync(fdWrite);
    },

    /**
     * @private
     * @param {boolean} createParentDirectories
     * @param {string} mode
     * @param {?function(Error)} callback
     */
    _createDirectory: function(createParentDirectories, mode, callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                if (createParentDirectories) {
                    _this.ensureParentDirectories(function(error) {
                        flow.complete(error);
                    });
                } else {
                    flow.complete();
                }
            }),
            $task(function(flow) {
                fs.mkdir(_this.getAbsolutePath(), mode, function(error) {
                    if (!error) {
                        flow.complete();
                    } else {
                        flow.error(new Error(error.message));
                    }
                });
            })
        ]).execute(callback);
    },

    /**
     * @private
     * @param {boolean} createParentDirectories
     * @param {string} mode
     */
    _createDirectorySync: function(createParentDirectories, mode) {
        if (createParentDirectories) {
            this.ensureParentDirectoriesSync(mode);
        }
        fs.mkdirSync(this.getAbsolutePath(), mode);
    },

    /**
     * If the file already exists, it is NOT MODIFIED
     * @private
     * @param {?(boolean|function(Error))=} createParentDirectories (defaults to true)
     * @param {?function(Error)} callback
     */
    _createFile: function(createParentDirectories, callback) {
        var _this = this;
        $series([
           $task(function(flow) {
                if (createParentDirectories) {
                    _this.ensureParentDirectories("0777", function(error) {
                        flow.complete(error);
                    });
                } else {
                    flow.complete();
                }
            }),
            $task(function(flow) {
                fs.writeFile(_this.getAbsolutePath(), "", function(error) {
                    if (!error) {
                        flow.complete();
                    } else {
                        flow.error(new Error(error.message));
                    }
                });
            })
        ]).execute(callback);
    },

    /**
     * @private
     * @param {boolean} createParentDirectories
     */
    _createFileSync: function(createParentDirectories) {
        if (createParentDirectories) {
            this.ensureParentDirectoriesSync("0777");
        }
        fs.writeFileSync(this.getAbsolutePath(), "");
    },

    /**
     * @param {boolean} recursive
     * @param {?function(Error)} callback
     */
    _delete: function(recursive, callback) {
        var _this = this;
        $if (function(flow) {
                _this.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        flow.assert(isDirectory);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $task(function(flow) {
                _this._deleteDirectory(recursive, function(error) {
                    flow.complete(error);
                });
            })
        ).$elseIf(function(flow) {
                _this.isFile(function(error, isFile) {
                    if (isFile) {
                        flow.assert(isFile);
                    } else {
                        flow.error(new Error("Cannot delete path '" + _this.getAbsolutePath() + "' because it is an " +
                            "unknown type."));
                    }
                });
            },
            $task(function(flow) {
                _this._deleteFile(function(error) {
                    flow.complete(error);
                })
            })
        ).execute(callback);
    },

    /**
     * @private
     * @param {boolean} recursive
     * @return {*}
     */
    _deleteSync: function(recursive) {
        if (this.isDirectorySync()) {
            this._deleteDirectorySync(recursive);
        } else if (this.isFileSync()) {
            this._deleteFileSync();
        } else {
            throw new Error("Cannot delete path '" + this.getAbsolutePath() + "' because it is an unknown type.");
        }
    },

    /**
     * @private
     * @param {boolean} recursive
     * @param {?function(Error)} callback
     */
    _deleteDirectory: function(recursive, callback) {
        var _this = this;
        var childPathArray = [];
        $series([
            $task(function(flow) {
                _this._readDirectory(function(error, pathArray) {
                    if (!error) {
                        childPathArray = pathArray;
                        flow.complete();
                    } else {
                        flow.error(error);
                    }
                });
            }),
            $task(function(flow) {
                if (childPathArray.length > 0) {
                    if (recursive) {
                        $foreach(childPathArray, function(boil, childPath) {
                            childPath._delete(recursive, function(error) {
                                boil.bubble(error);
                            });
                        }).execute([], function(error) {
                            flow.complete(error);
                        });
                    } else {
                        flow.error(new Error("Cannot delete a non-empty directory. Must delete recursively to " +
                            "delete a non-empty directory."));
                    }
                } else {
                    flow.complete();
                }
            }),
            $task(function(flow) {
                fs.rmdir(_this.getAbsolutePath(), function(error) {
                    if (!error) {
                        flow.complete();
                    } else {
                        flow.error(new Error(error.message));
                    }
                });
            })
        ]).execute(callback);
    },

    /**
     * @private
     * @param {boolean} recursive
     */
    _deleteDirectorySync: function(recursive) {
        var childPathArray = this._readDirectorySync();
        if (childPathArray.length > 0) {
            if (recursive) {
                childPathArray.forEach(function(childPath) {
                    childPath._deleteSync(recursive);
                });
            } else {
                throw new Error("Cannot delete a non-empty directory. Must delete recursively to delete a " +
                    "non-empty directory.");
            }
        }
        fs.rmdirSync(this.getAbsolutePath());
    },

    /**
     * @private
     * @param {?function(Error)} callback
     */
    _deleteFile: function(callback) {
        fs.unlink(this.getAbsolutePath(), function(error) {
            if (error) {
                error = new Error(error.message);
            }
            callback(error);
        });
    },

    /**
     * @private
     */
    _deleteFileSync: function() {
        fs.unlinkSync(this.getAbsolutePath());
    },

    /**
     * @private
     * @param {?function(Error, boolean)} callback
     */
    _isDirectoryEmpty: function(callback) {
        this._readDirectory(function(error, pathArray) {
            if (!error) {
                callback(null, (pathArray.length === 0))
            } else {
                callback(error);
            }
        });
    },

    /**
     * @private
     * @return {boolean}
     */
    _isDirectoryEmptySync: function() {
        var pathArray = this._readDirectorySync();
        return (pathArray.length === 0);
    },

    /**
     * @param {Path} movePath
     * @param {Path.SyncMode} syncMode (defaults to Path.SyncMode.STOP)
     * @param {?function(Error)} callback
     */
    _move: function(movePath, syncMode, callback) {
        var _this = this;
        $if (function(flow) {
                _this.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        flow.assert(isDirectory);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $task(function(flow) {
                _this._moveDirectory(movePath, syncMode, function(error) {
                    flow.complete(error);
                });
            })
        ).$elseIf (function(flow) {
                _this.isFile(function(error, isFile) {
                    if (!error) {
                        flow.assert(isFile);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $task(function(flow) {
                _this._moveFile(movePath, syncMode, function(error) {
                    flow.complete(error);
                });
            })
        ).$else (
            $task(function(flow) {
                flow.error(new Error("Cannot move path '" + _this.getAbsolutePath() + "' because it is an " +
                    "unknown type."));
            })
        ).execute(callback);
    },

    /**
     * @private
     * @param {Path} movePath
     * @param {Path.SyncMode} syncMode
     */
    _moveSync: function(movePath, syncMode) {
        if (this.isDirectorySync()) {
            this._moveDirectorySync(movePath, syncMode);
        } else if (this.isFileSync()) {
            this._moveFileSync(movePath, syncMode);
        } else {
            throw new Error("Cannot move path '" + this.getAbsolutePath() + "' because it is an unknown type.");
        }
    },

    /**
     * @private
     * @param {Path} movePath
     * @param {Path.SyncMode} syncMode
     * @param {?function(Error)} callback
     */
    _moveDirectory: function(movePath, syncMode, callback) {

        //TODO BRN: Add support for limiting the number of open file handles. Checkout ncp module https://github.com/AvianFlu/ncp/blob/master/lib/ncp.js
        /*if (running >= limit) {
         return process.nextTick(function () {
         getStats(source);
         });
         }*/

        var _this = this;
        $if (function(flow) {
                movePath.exists(function(exists) {
                    flow.assert(exists);
                });
            },
            $task(function(flow) {
                switch (syncMode) {
                    case Path.SyncMode.MERGE_REPLACE:
                        _this._moveDirectoryMergeReplace(movePath, syncMode, function(error) {
                            flow.complete(error);
                        });
                        break;
                    case Path.SyncMode.MERGE_STOP:
                        _this._moveDirectoryMergeStop(movePath, syncMode, function(error) {
                            flow.complete(error);
                        });
                        break;
                    case Path.SyncMode.REPLACE:
                        _this._moveDirectoryReplace(movePath, function(error) {
                            flow.complete(error);
                        });
                        break;
                    default:
                        flow.complete();
                }
            })
        ).$else(
            $task(function(flow) {
                _this._rename(movePath, function(error) {
                    flow.complete(error);
                });
            })
        ).execute(callback);
    },

    /**
     * @private
     * @param {Path} movePath
     * @param {Path.SyncMode} syncMode
     */
    _moveDirectorySync: function(movePath, recursive, syncMode) {
        if (movePath.existsSync()) {

            //NOTE BRN: Do nothing in the STOP case

            switch (syncMode) {
                case Path.SyncMode.MERGE_REPLACE:
                    this._moveDirectoryMergeReplaceSync(movePath, syncMode);
                    break;
                case Path.SyncMode.MERGE_STOP:
                    this._moveDirectoryMergeStopSync(movePath, syncMode);
                    break;
                case Path.SyncMode.REPLACE:
                    this._moveDirectoryReplaceSync(movePath);
                    break;
            }
        } else {
            this._renameSync(movePath);
        }
    },

    /**
     * @private
     * @param {Path} movePath
     * @param {Path.SyncMode} syncMode
     * @param {?function(Error)} callback
     */
    _moveDirectoryMergeReplace: function(movePath, syncMode, callback) {
        var _this = this;
        $if (function(flow) {
                movePath.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        flow.assert(isDirectory);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $task(function(flow) {
                _this._moveDirectoryContents(movePath, syncMode, function(error) {
                    flow.complete(error);
                });
            })
        ).$elseIf(function(flow) {
                movePath.isFile(function(error, isFile) {
                    if (!error) {
                        flow.assert(isFile);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $series([
                $task(function(flow) {
                    movePath._deleteFile(function(error) {
                        flow.complete(error);
                    })
                }),
                $task(function(flow) {
                    _this._rename(movePath, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).execute(callback);
    },

    /**
     * @private
     * @param {Path} movePath
     * @param {Path.SyncMode} syncMode
     */
    _moveDirectoryMergeReplaceSync: function(movePath, syncMode) {

        //NOTE BRN: Do nothing if we don't recognize the type (symlink)

        if (movePath.isDirectorySync()) {
            this._moveDirectoryContentsSync(movePath, syncMode);
        } else if (movePath.isFileSync()) {
            movePath._deleteFileSync();
            this._renameSync(movePath);
        }
    },

    /**
     * @private
     * @param {Path} movePath
     * @param {Path.SyncMode} syncMode
     * @param {?function(Error)} callback
     */
    _moveDirectoryMergeStop: function(movePath, syncMode, callback) {
        var _this = this;
        movePath.isDirectory(function(error, isDirectory) {
            if (!error) {
                if (isDirectory) {
                    _this._moveDirectoryContents(movePath, syncMode, callback);
                } else {
                    callback();
                }
            } else {
                callback(error);
            }
        });
    },

    /**
     * @private
     * @param {Path} movePath
     * @param {Path.SyncMode} syncMode
     */
    _moveDirectoryMergeStopSync: function(movePath, syncMode) {

        //NOTE BRN: Do nothing if the copyPath is a file we don't recognize the type (symlink)

        if (movePath.isDirectorySync()) {
            this._moveDirectoryContentsSync(movePath, syncMode);
        }
    },

    /**
     * @private
     * @param {Path} movePath
     * @param {?function(Error)} callback
     */
    _moveDirectoryReplace: function(movePath, callback) {
        var _this = this;
        $if (function(flow) {
                movePath.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        flow.assert(isDirectory);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $series([
                $task(function(flow) {
                    movePath._deleteDirectory(true, function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._rename(movePath, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).$elseIf(function(flow) {
                movePath.isFile(function(error, isFile) {
                    if (!error) {
                        flow.assert(isFile);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $series([
                $task(function(flow) {
                    movePath._deleteFile(function(error) {
                        flow.complete(error);
                    })
                }),
                $task(function(flow) {
                    _this._rename(movePath, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).execute(callback);
    },

    /**
     * @private
     * @param {Path} movePath
     */
    _moveDirectoryReplaceSync: function(movePath) {

        //NOTE BRN: Do nothing if we don't recognize the type (symlink)

        if (movePath.isDirectorySync()) {
            movePath._deleteDirectorySync(true);
            this._renameSync(movePath);
        } else if (movePath.isFileSync()) {
            movePath._deleteFileSync();
            this._renameSync(movePath);
        }
    },

    /**
     * @private
     * @param {Path} intoPath
     * @param {Path.SyncMode} syncMode
     * @param {?function(Error)} callback
     */
    _moveDirectoryContents: function(intoPath, syncMode, callback) {
        //TODO BRN: Add support for limiting the number of open file handles. Checkout ncp module https://github.com/AvianFlu/ncp/blob/master/lib/ncp.js
        var _this = this;
        var childPathArray = [];
        $series([
            $task(function(flow) {
                _this._readDirectory(function(error, pathArray) {
                    if (!error) {
                        childPathArray = pathArray;
                        flow.complete();
                    } else {
                        flow.error(error);
                    }
                });
            }),
            $task(function(flow) {
                $foreach(childPathArray, function(boil, childPath) {
                    var movePath = new Path(intoPath.getAbsolutePath() + path.sep + childPath.getName());
                    childPath._move(movePath, syncMode, function(error) {
                        boil.bubble(error);
                    });
                }).execute(function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },

    /**
     * @private
     * @param {Path} intoPath
     * @param {Path.SyncMode} syncMode
     */
    _moveDirectoryContentsSync: function(intoPath, syncMode) {
        var childPathArray = intoPath._readDirectorySync();
        childPathArray.forEach(function(childPath) {
            var movePath = new Path(intoPath.getAbsolutePath() + path.sep + childPath.getName());
            childPath._moveSync(movePath, syncMode);
        });
    },

    /**
     * @private
     * @param {Path} movePath
     * @param {Path.SyncMode} syncMode
     * @param {?function(Error)} callback
     */
    _moveFile: function(movePath, syncMode, callback) {

        //TODO BRN: Add support for limiting the number of open file handles. Checkout ncp module https://github.com/AvianFlu/ncp/blob/master/lib/ncp.js

        var _this = this;
        $if (function(flow) {
                movePath.exists(function(exists) {
                    flow.assert(exists);
                });
            },
            $task(function(flow) {
                switch (syncMode) {
                    case Path.SyncMode.MERGE_REPLACE:
                        _this._moveFileMergeReplace(movePath, function(error) {
                            flow.complete(error);
                        });
                        break;
                    case Path.SyncMode.REPLACE:
                        _this._moveFileReplace(movePath, function(error) {
                            flow.complete(error);
                        });
                        break;
                    default:
                        flow.complete();
                }
            })
        ).$else(
            $series([
                $task(function(flow) {
                    _this._rename(movePath, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).execute(callback);
    },

    /**
     * @private
     * @param {Path} movePath
     * @param {Path.SyncMode} syncMode
     */
    _moveFileSync: function(movePath, syncMode) {
        if (movePath.existsSync()) {

            //NOTE BRN: Do nothing in the STOP case AND the MERGE_STOP

            switch (syncMode) {
                case Path.SyncMode.MERGE_REPLACE:
                    this._moveFileMergeReplaceSync(movePath);
                    break;
                case Path.SyncMode.REPLACE:
                    this._moveFileReplaceSync(movePath);
                    break;
            }
        } else {
            this._renameSync(movePath);
        }
    },

    /**
     * @private
     * @param {Path} movePath
     * @param {?function(Error)} callback
     */
    _moveFileMergeReplace: function(movePath, callback) {
        var _this = this;
        $if (function(flow) {
                movePath.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        flow.assert(isDirectory);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $series([
                $task(function(flow) {
                    movePath._deleteDirectory(true, function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._rename(movePath, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).$elseIf(function(flow) {
                movePath.isFile(function(error, isFile) {
                    if (!error) {
                        flow.assert(isFile);
                    } else {
                        flow.error(error);
                    }
                })
            },
            $series([
                $task(function(flow) {
                    movePath._deleteFile(function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._rename(movePath, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).execute(callback);
    },

    /**
     * @private
     * @param {Path} movePath
     */
    _moveFileMergeReplaceSync: function(movePath) {

        //NOTE BRN: Do nothing if we don't recognize the type (symlink)

        if (movePath.isDirectorySync()) {
            movePath._deleteDirectorySync(true);
            this._renameSync(movePath);
        } else if (movePath.isFileSync()) {
            movePath._deleteFileSync();
            this._renameSync(movePath);
        }
    },

    /**
     * @private
     * @param {Path} movePath
     * @param {?function(Error)} callback
     */
    _moveFileReplace: function(movePath, callback) {
        var _this = this;
        $if (function(flow) {
                movePath.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        flow.assert(isDirectory);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $series([
                $task(function(flow) {
                    movePath._deleteDirectory(true, function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._rename(movePath, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).$elseIf(function(flow) {
                movePath.isFile(function(error, isFile) {
                    if (!error) {
                        flow.assert(isFile);
                    } else {
                        flow.error(error);
                    }
                })
            },
            $series([
                $task(function(flow) {
                    movePath._deleteFile(function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._rename(movePath, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).execute(callback);
    },

    /**
     * @private
     * @param {Path} movePath
     */
    _moveFileReplaceSync: function(movePath) {

        //NOTE BRN: Do nothing if we don't recognize the type (symlink)

        if (movePath.isDirectorySync()) {
            movePath._deleteDirectorySync(true);
            this._renameSync(movePath);
        } else if (movePath.isFileSync()) {
            movePath._deleteFileSync();
            this._renameSync(movePath);
        }
    },

    /**
     * @private
     * @param {?function(Error, Array.<Path>)} callback
     */
    _readDirectory: function(callback) {
        var _this = this;
        fs.readdir(this.getAbsolutePath(), function(error, files) {
            if (!error) {
                var pathArray = [];
                files.forEach(function(name) {
                    var childPathString = _this.getAbsolutePath() + path.sep + name;
                    pathArray.push(new Path(childPathString));
                });
                callback(null, pathArray);
            } else {
                callback(new Error(error.message));
            }
        });
    },

    /**
     * @private
     * @return {Array.<Path>}
     */
    _readDirectorySync: function() {
        var _this = this;
        var files = fs.readdirSync(this.getAbsolutePath());
        var pathArray = [];
        files.forEach(function(name) {
            var childPathString = _this.getAbsolutePath() + path.sep + name;
            pathArray.push(new Path(childPathString));
        });
        return pathArray;
    },

    /**
     * @private
     * @param {Path} namePath
     * @param {function(Error)} callback
     */
    _rename: function(namePath, callback) {
        fs.rename(this.getAbsolutePath(), namePath.getAbsolutePath(), callback);
    },

    /**
     * @private
     * @param {Path} namePath
     */
    _renameSync: function(namePath) {
        fs.renameSync(this.getAbsolutePath(), namePath.getAbsolutePath());
    },

    /**
     * @private
     * @param {string} data
     * @param {string} encoding
     * @param {?function(Error)} callback
     */
    _writeFile: function(data, encoding, callback) {
        fs.writeFile(this.getAbsolutePath(), data, encoding, function(error) {
            if (error) {
                error = new Error(error.message);
            }
            if (callback) {
                callback(error);
            } else {
                throw error;
            }
        });
    },

    /**
     * @private
     * @param {string} data
     * @param {string} encoding
     */
    _writeFileSync: function(data, encoding) {
        fs.writeFileSync(this.getAbsolutePath(), data, encoding);
    },


    //---------------------------

    /**
     * @private
     * @param {Path} intoPath
     * @param {function(error)} callback
     */
    ensureCopyIntoPath: function(intoPath, callback) {
        $series([
            $task(function(flow) {
                intoPath.exists(function(exists) {
                    if (!exists) {
                        intoPath.createDirectory(true, "0777", function(error) {
                            flow.complete(error);
                        });
                    } else {
                        flow.complete();
                    }
                })
            }),
            $task(function(flow) {
                intoPath.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        if (!isDirectory) {
                            flow.error(new Error("Cannot copy into path '" + intoPath.getAbsolutePath() + "' because it is not a " +
                                "directory."));
                        } else {
                            flow.complete();
                        }
                    } else {
                        flow.error(error);
                    }
                });
            })
        ]).execute(callback);
    },

    /**
     * @private
     * @param {Path} intoPath
     */
    ensureCopyIntoPathSync: function(intoPath) {
        if (!intoPath.existsSync()) {
            intoPath._createDirectorySync(true, "0777");
        } else if (!intoPath.isDirectorySync()) {
            throw new Error("Cannot copy to path '" + intoPath.getAbsolutePath() + "' because it is not a " +
                "directory.");
        }
    },

    /**
     * @private
     * @param {string} mode
     * @param {?function(Error)} callback
     */
    ensureParentDirectories: function(mode, callback) {
        var parentPath = this.getParentPath();
        parentPath.createDirectory(true, mode, function(error) {
            callback(error);
        });
    },

    /**
     * @private
     * @param {string} mode
     */
    ensureParentDirectoriesSync: function(mode) {
        var parentPath = this.getParentPath();
        parentPath.createDirectorySync(true, mode);
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
Path.SyncMode = {
    MERGE_REPLACE: "SyncMode:MergeReplace",
    MERGE_STOP: "SyncMode:MergeStop",
    REPLACE: "SyncMode:Replace",
    STOP: "SyncMode:Stop"
};

//TODO BRN: See if there's a way we can retrieve this value from the OS.
/**
 * @private
 * @type {number}
 */
Path.fileHandleLimit = 512;

/**
 * @private
 * @type {number}
 */
Path.numberOpenFileHandles = 0;


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(Path);
