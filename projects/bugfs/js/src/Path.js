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

var each = BugBoil.each;
var series = BugFlow.series;
var task = BugFlow.task;


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
     * @param {?(boolean|function(Error))=} overwrite (defaults to true)
     * @param {?function(Error, Path)} callback
     */
    copy: function(intoPath, recursive, overwrite, callback) {
        if (TypeUtil.isFunction(recursive)) {
            callback = recursive;
            recursive = true;
            overwrite = true;
        }
        if (TypeUtil.isFunction(overwrite)) {
            callback = overwrite;
            overwrite = true;
        }
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;
        overwrite = TypeUtil.isBoolean(overwrite) ? overwrite : true;
        var _this = this;
        var _copyPath = null;
        series([
            task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot copy path '" + _this.getAbsolutePath() + "' because it does " +
                            "not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            task(function(flow) {
                _this._copy(intoPath, recursive, overwrite, function(error, copyPath) {
                    if (!error) {
                        _copyPath = copyPath;
                        flow.complete();
                    } else {
                        flow.error(error);
                    }
                });
            })
        ]).execute(function(error) {
            callback(error, _copyPath);
        });
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?boolean=} recursive
     * @param {?boolean=} overwrite
     * @return {Path}
     */
    copySync: function(intoPath, recursive, overwrite) {
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;
        overwrite = TypeUtil.isBoolean(overwrite) ? overwrite : true;
        if (this.existsSync()) {
            if (this.isDirectorySync()) {
                return this._copyDirectorySync(intoPath, recursive, overwrite);
            } else if (this.isFileSync()) {
                return this._copyFileSync(intoPath, overwrite);
            } else {
                throw new Error("Cannot copy path '" + this.getAbsolutePath() + "' because it is an unknown type.");
            }
        } else {
            throw new Error("Cannot copy path '" + this.getAbsolutePath() + "' because it does not exist.")
        }
    },

    //TODO BRN: add option for "preserve" See http://en.wikipedia.org/wiki/Cp_(Unix) for description.
    /**
     * Rules for DIRECTORY copy
     * 1) The intoPath must be a directory (or not created).
     * 2) If the intoPath does not exist, this function will attempt to create the intoPath.
     * 3) This function will look in the intoPath for a directory by the name of this directory
     * 3a) If a directory by the name of this one exists and overwrite is true, it will attempt to merge this directory's
     * contents with that one
     * 3b) If a directory by the name of this one exists and overwrite is false, it will not attempt a copy.
     * 3c) If a directory by the name of this one does NOT exist, it will create a directory with this name. The
     * directory's contents will then be copied in to the newly created directory.
     * 6) This will not copy files recursively unless the "recursive" option is set to true.
     * @param {(string|Path)} intoPath
     * @param {?(boolean|function(Error))=} recursive (defaults to true)
     * @param {?(boolean|function(Error))=} overwrite (defaults to true)
     * @param {?function(Error, Path)} callback
     */
    copyDirectory: function(intoPath, recursive, overwrite, callback) {
        if (TypeUtil.isFunction(recursive)) {
            callback = recursive;
            recursive = true;
            overwrite = true;
        }
        if (TypeUtil.isFunction(overwrite)) {
            callback = overwrite;
            overwrite = true;
        }
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;
        overwrite = TypeUtil.isBoolean(overwrite) ? overwrite : true;

        var _this = this;
        var _copyPath = null;
        series([
            task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot copy directory '" + _this.getAbsolutePath() + "' because it does not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            task(function(flow) {
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
            task(function(flow) {
                _this._copyDirectory(intoPath, recursive, overwrite, function(error, copyPath) {
                    if (!error) {
                        _copyPath = copyPath;
                        flow.complete(error);
                    } else {
                        flow.error(error);
                    }
                });
            })
        ]).execute(function(error) {
            callback(error, _copyPath);
        });
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?boolean=} recursive (defaults to true)
     * @param {?boolean=} overwrite (defaults to true)
     * @return {Path}
     */
    copyDirectorySync: function(intoPath, recursive, overwrite) {
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;
        overwrite = TypeUtil.isBoolean(overwrite) ? overwrite : true;
        if (!this.existsSync()) {
            throw new Error("Cannot copy directory '" + this.getAbsolutePath() + "' because it does not exist.");
        }
        if (!this.isDirectorySync()) {
            throw new Error("Cannot perform a directory copy on '" + this.getAbsolutePath() + "' because it is not a" +
                " directory");
        }
        this._copyDirectorySync(intoPath, recursive, overwrite);
    },

    /**
     * Rules for DIRECTORY copy CONTENTS
     * 1) The intoPath must be a directory (or not created).
     * 2) If the intoPath exists, this function will copy the CONTENTS of this path INTO the intoPath
     * 3) If the intoPath does not exist, this function will attempt to create the intoPath and then copy the contents.
     * 4) This will not copy files recursively unless the "recursive" option is set to true.
     * @param {(string|Path)} intoPath
     * @param {?(boolean|function(Error))=} recursive (defaults to true)
     * @param {?(boolean|function(Error))=} overwrite (defaults to true)
     * @param {?function(Error)} callback
     */
    copyDirectoryContents: function(intoPath, recursive, overwrite, callback) {
        if (TypeUtil.isFunction(recursive)) {
            callback = recursive;
            recursive = true;
            overwrite = true;
        }
        if (TypeUtil.isFunction(overwrite)) {
            callback = overwrite;
            overwrite = true;
        }
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;
        overwrite = TypeUtil.isBoolean(overwrite) ? overwrite : true;

        var _this = this;

        series([
            task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot copy contents of directory '" + _this.getAbsolutePath() + "' " +
                            "because it does not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            task(function(flow) {
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
            task(function(flow) {
                _this._copyDirectoryContents(intoPath, recursive, overwrite, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?boolean=} recursive (defaults to true)
     * @param {?boolean=} overwrite (defaults to true)
     * @return {Path}
     */
    copyDirectoryContentsSync: function(intoPath, recursive, overwrite) {
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;
        overwrite = TypeUtil.isBoolean(overwrite) ? overwrite : true;
        if (this.existsSync()) {
            if (this.isDirectorySync()) {
                this._copyDirectoryContentsSync(intoPath, recursive, overwrite);
            } else {
                throw new Error("Cannot perform a directory contents copy on '" + this.getAbsolutePath() +
                    "' because it is not a directory.")
            }
        } else {
            throw new Error("Cannot copy contents of directory '" + this.getAbsolutePath() + "' because it does " +
                "not exist.");
        }
    },

    //TODO BRN: add option for "preserve" See http://en.wikipedia.org/wiki/Cp_(Unix) for description.
    /**
     * Rules for FILE copy
     * 1) If the intoPath does not exist, this function will attempt to create the file. This includes any directories
     * in the intoPath.
     * 2) If the intoPath exists and overwrite is true, the intoPath file's CONTENTS will be replace with this file's
     * contents.
     * 3) If the intoPath exists and overwrite is false, the file will not be copied.
     * @param {(string|Path)} intoPath
     * @param {?(boolean|function(Error))=} overwrite (defaults to true)
     * @param {?function(Error, Path)} callback
     */
    copyFile: function(intoPath, overwrite, callback) {
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        overwrite = TypeUtil.isBoolean(overwrite) ? overwrite : true;
        if (TypeUtil.isFunction(overwrite)) {
            callback = overwrite;
            overwrite = true;
        }

        var _this = this;
        var _copyPath = null;
        series([
            task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot copy file '" + _this.getAbsolutePath() + "' because it does " +
                            "not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            task(function(flow) {
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
            task(function(flow) {
                _this._copyFile(intoPath, overwrite, function(error, copyPath) {
                    if (!error) {
                        _copyPath = copyPath;
                        flow.complete();
                    } else {
                        flow.error(error);
                    }
                });
            })
        ]).execute(function(error) {
             callback(error, _copyPath);
        });
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?boolean=} overwrite (defaults to true)
     * @return {Path}
     */
    copyFileSync: function(intoPath, overwrite) {
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        overwrite = TypeUtil.isBoolean(overwrite) ? overwrite : true;
        if (!this.existsSync()) {
            throw new Error("Cannot copy file '" + this.getAbsolutePath() + "' because it does not exist.");
        }
        if (!this.isFileSync()) {
            throw new Error("Cannot perform a file copy on '" + this.getAbsolutePath() + "' because it is not " +
                "a file.");
        }
        return this._copyFileSync(intoPath, overwrite);
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
            createParentDirectories = true;
            mode = '0777';
        }
        if (TypeUtil.isFunction(mode)) {
            callback = mode;
            mode = '0777';
        }
        createParentDirectories = TypeUtil.isBoolean(createParentDirectories) ? createParentDirectories : true;
        mode = TypeUtil.isString(mode) ? mode : '0777';

        var _this = this;
        var exists = false;
        series([
            task(function(flow) {
                _this.exists(function(_exists) {
                    exists = _exists;
                    flow.complete();
                });
            }),
            task(function(flow) {
                if (!exists) {
                    _this._createDirectory(createParentDirectories, mode, function(error) {
                        flow.complete(error);
                    });
                } else {

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
                }
            })
        ]).execute(function(error) {
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
            return this;
        } else if (!this.isDirectorySync()) {
            throw new Error("Could not create directory '" + this.getAbsolutePath() + "' because it already exists " +
                "and is not a directory.");
        }
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
            createParentDirectories = true;
        }
        createParentDirectories = TypeUtil.isBoolean(createParentDirectories) ? createParentDirectories : true;

        var _this = this;
        var exists = false;
        series([
            task(function(flow) {
                _this.exists(function(_exists) {
                    exists = _exists;
                    flow.complete();
                });
            }),
            task(function(flow) {
                if (!exists) {
                    _this._createFile(createParentDirectories, function(error) {
                        flow.complete(error);
                    });
                } else {

                    // NOTE BRN: We check this to make sure that the given path did not exist already as a file.

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
                }
            })
        ]).execute(function(error) {
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
            return this;
        } else if (!this.isFileSync()) {
            throw new Error("Could not create file '" + this.getAbsolutePath() + "' because it already exists " +
                "and is not a file.");
        }
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
            recursive = true;
        }
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;

        var _this = this;
        series([
            task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {

                        // NOTE BRN: We don't throw an error here. We just fail gracefully.

                        flow.exit();
                    } else {
                        flow.complete();
                    }
                });
            }),
            task(function(flow) {
                _this._delete(recursive, overwrite, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(callback);
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
            recursive = true;
        }
        recursive = TypeUtil.isBoolean(recursive) ? recursive : true;

        var _this = this;
        series([
            task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.exit();
                    } else {
                        flow.complete();
                    }
                });
            }),
            task(function(flow) {
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
            task(function(flow) {
                _this._deleteDirectory(recursive, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(callback);
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
        series([
            task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.exit();
                    } else {
                        flow.complete();
                    }
                });
            }),
            task(function(flow) {
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
            task(function(flow) {
                _this._deleteFile(function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(callback);
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
        series([
            task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot check if directory '" + _this.getAbsolutePath() + "' is empty because it " +
                            "does not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            task(function(flow) {
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
            task(function(flow) {
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
     * @param {?(boolean|function(Error))=} overwrite (defaults to true)
     * @param {?function(Error)} callback
     */
    move: function(intoPath, overwrite, callback) {
        var _this = this;
        this.isDirectory(function(error, isDirectory) {
            if (isDirectory) {
                _this.moveDirectory(intoPath, overwrite, callback);
            }
        });
    },

    moveDirectory: function(intoPath, overwrite, callback) {
        //TODO BRN: Implementation
    },

    moveDirectorySync: function(intoPath, overwrite) {

    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?(boolean|function(Error))=} overwrite (defaults to false)
     * @param {?function(Error)} callback
     */
    moveFile: function(intoPath, overwrite, callback) {
        if (TypeUtil.isFunction(overwrite)) {
            callback = overwrite;
            overwrite = false;
        }
        overwrite = TypeUtil.isBoolean(overwrite) ? overwrite : true;
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        this._moveFile(intoPath, overwrite, callback);
    },

    /**
     * @param {(string|Path)} intoPath
     * @param {?boolean=} overwrite (defaults to false)
     */
    moveFileSync: function(intoPath, overwrite) {
        intoPath = TypeUtil.isString(intoPath) ? new Path(intoPath) : intoPath;
        overwrite = TypeUtil.isBoolean(overwrite) ? overwrite : true;
        if (!this.existsSync()) {
            throw new Error("Cannot move file '" + this.getAbsolutePath() + "' because it does" +
                "not exist.");
        }
        this._moveFileSync(intoPath, overwrite);
    },

    /**
     * @param {?function(Error, Array<Path>)} callback
     */
    readDirectory: function(callback) {
        var _this = this;
        var dirPaths = null;
        series([
            task(function(flow) {
                _this.exists(function(exists) {
                    if (!exists) {
                        flow.error(new Error("Cannot read directory '" + _this.getAbsolutePath() + "' because it " +
                            "does not exist."));
                    } else {
                        flow.complete();
                    }
                });
            }),
            task(function(flow) {
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
            task(function(flow) {
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
     * Rules for copy
     * 1) If this Path is a directory, it will perform a copyDirectory call
     * 2) If this Path is a file, it will perform a copyFile call
     * @param {Path} intoPath
     * @param {boolean} recursive (defaults to true)
     * @param {boolean} overwrite (defaults to true)
     * @param {?function(Error, Path)} callback
     */
    _copy: function(intoPath, recursive, overwrite, callback) {
        var _this = this;
        var _copyPath = null;
        series([
            task(function(flow) {
                _this.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        if (isDirectory) {
                            _this._copyDirectory(intoPath, recursive, overwrite, function(error, copyPath) {
                                if (!error) {
                                    _copyPath = copyPath;
                                    flow.exit();
                                } else {
                                    flow.error(error);
                                }
                            });
                        } else {
                            flow.complete();
                        }
                    } else {
                        flow.error(error);
                    }
                });
            }),
            task(function(flow) {
                _this.isFile(function(error, isFile) {
                    if (isFile) {
                        flow._copyFile(intoPath, overwrite, function(error, copyPath) {
                            if (!error) {
                                _copyPath = copyPath;
                                flow.complete();
                            } else {
                                flow.error(error);
                            }
                        });
                    } else {
                        flow.error(new Error("Cannot copy path '" + _this.getAbsolutePath() + "' because it is an " +
                            "unknown type."));
                    }
                })
            })
        ]).execute(function(error) {
            callback(error, _copyPath);
        });
    },

    /**
     * @private
     * @param {Path} intoPath
     * @param {boolean} recursive
     * @param {boolean} overwrite
     * @param {?function(Error, Path)} callback
     */
    _copyDirectory: function(intoPath, recursive, overwrite, callback) {

        //TODO BRN: Add support for limiting the number of open file handles. Checkout ncp module https://github.com/AvianFlu/ncp/blob/master/lib/ncp.js
        /*if (running >= limit) {
         return process.nextTick(function () {
         getStats(source);
         });
         }*/

        var _this = this;
        var _copyPath = null;
        var _copyPathExists = false;

        series([
            task(function(flow) {
                intoPath.exists(function(exists) {
                    if (!exists) {
                        intoPath._createDirectory(true, "0777", function(error) {
                            flow.complete(error);
                        });
                    } else {
                        intoPath.isDirectory(function(error, isDirectory) {
                            if (!error) {
                                if (isDirectory) {
                                    flow.complete();
                                } else {
                                    flow.error("Cannot copy to path '" + intoPath.getAbsolutePath() + "' because it is" +
                                        "not a directory.");
                                }
                            } else {
                                flow.error(error);
                            }
                        });
                    }
                });
            }),
            task(function(flow) {
                _copyPath = new Path(intoPath.getAbsolutePath() + path.sep + _this.getName());
                _copyPath.exists(function(exists) {
                    _copyPathExists = exists;
                    flow.complete();
                });
            }),
            task(function(flow) {
                if (!_copyPathExists) {
                    _copyPath._createDirectory(true, "0777", function(error) {
                        flow.complete(error);
                    });
                } else {
                    _copyPath.isDirectory(function(error, isDirectory) {
                        if (!error) {
                            if (isDirectory) {
                                if (overwrite) {
                                    flow.complete();
                                } else {
                                    flow.error(new Error("Cannot copy directory '" + _this.getAbsolutePath() + "' to " +
                                        "' " + _copyPath.getAbsolutePath() + "' because it already exists and " +
                                        "overwrite is not turned on."));
                                }
                            } else {
                                flow.error(new Error("Cannot copy to directory '" + _copyPath.getAbsolutePath() +
                                    "' because it is not a directory."));
                            }
                        } else {
                            flow.error(error);
                        }
                    });
                }
            }),
            task(function(flow) {
                _this._copyDirectoryContents(_copyPath, true, "0777", function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(error) {
            callback(error, _copyPath);
        });
    },

    /**
     * @private
     * @param {Path} intoPath
     * @param {boolean} recursive
     * @param {boolean} overwrite
     * @return {Path}
     */
    _copyDirectorySync: function(intoPath, recursive, overwrite) {
        if (!intoPath.existsSync()) {
            intoPath._createDirectorySync(true, "0777");
        } else if (!intoPath.isDirectorySync()) {
            throw new Error("Cannot copy to path '" + intoPath.getAbsolutePath() + "' because it is not a " +
                "directory.");
        }
        var copyPath = new Path(intoPath.getAbsolutePath() + path.sep + this.getName());
        if (!copyPath.existsSync()) {
            copyPath._createDirectorySync(true, "0777");
            this._copyDirectoryContentsSync(copyPath, recursive, overwrite);
        } else {
            if (copyPath.isDirectorySync()) {
                if (overwrite) {
                    this._copyDirectoryContentsSync(copyPath, recursive, overwrite);
                } else {
                    throw new Error("Cannot copy directory '" + this.getAbsolutePath() + "' to '" +
                        copyPath.getAbsolutePath() + "' because it already exists and overwrite is not turned on.");
                }
            } else {
                throw new Error("Cannot copy to directory '" + copyPath.getAbsolutePath() + "' because it is not " +
                    "a directory.");
            }
        }
        return copyPath;
    },

    /**
     * @private
     * @param {Path} intoPath
     * @param {boolean} recursive
     * @param {boolean} overwrite
     * @param {?function(Error)} callback
     */
    _copyDirectoryContents: function(intoPath, recursive, overwrite, callback) {
        //TODO BRN: Add support for limiting the number of open file handles. Checkout ncp module https://github.com/AvianFlu/ncp/blob/master/lib/ncp.js
        var _this = this;
        var childPathArray = [];
        series([
            task(function(flow) {
                intoPath.exists(function(exists) {
                    if (!exists) {
                        intoPath._createDirectory(true, "0777", function(error) {
                            flow.complete(error);
                        });
                    } else {
                        flow.complete();
                    }
                });
            }),
            task(function(flow) {
                intoPath.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        if (isDirectory) {
                            flow.complete();
                        } else {
                            flow.error("Cannot copy contents to path '" + intoPath.getAbsolutePath() + "' because it " +
                                "is not a directory.");
                        }
                    } else {
                        flow.error(error);
                    }
                });
            }),
            task(function(flow) {
                _this._readDirectory(function(error, pathArray) {
                    if (!error) {
                        childPathArray = pathArray;
                        flow.complete();
                    } else {
                        flow.error(error);
                    }
                });
            }),
            task(function(flow) {
                each(childPathArray, function(boil, childPath) {
                    childPath.isDirectory(function(error, isDirectory) {
                        if (!error) {
                            if (isDirectory) {
                                if (recursive) {
                                    childPath._copyDirectory(intoPath, recursive, overwrite, function(error) {
                                        boil.bubble(error);
                                    });
                                } else {
                                    boil.bubble();
                                }
                            } else {
                                childPath.isFile(function(error, isFile) {
                                    if (!error) {
                                        if (isFile) {
                                            childPath._copyFile(intoPath, overwrite, function(error) {
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
     * @param {boolean} overwrite
     */
    _copyDirectoryContentsSync: function(intoPath, recursive, overwrite) {
        if (!intoPath.existsSync()) {
            intoPath.createDirectorySync(true, "0777");
        }

        if (!intoPath.isDirectorySync()) {
            throw new Error("Cannot copy contents to directory '" + intoPath.getAbsolutePath() + "' because it is " +
                "not a directory.");
        }

        var childPathArray = intoPath._readDirectorySync();
        childPathArray.forEach(function(childPath) {
            if (childPath.isDirectorySync() && recursive) {
                childPath._copyDirectorySync(intoPath, recursive, overwrite);
            } else if (childPath.isFileSync()) {
                childPath._copyFileSync(intoPath, overwrite);
            }
        });
    },

    //TODO BRN: add option for "preserve" See http://en.wikipedia.org/wiki/Cp_(Unix) for description.
    /**
     * @private
     * @param {Path} intoPath
     * @param {boolean} overwrite (defaults to true)
     * @param {?function(Error)} callback
     */
    _copyFile: function(intoPath, overwrite, callback) {

        //TODO BRN: Add support for limiting the number of open file handles. Checkout ncp module https://github.com/AvianFlu/ncp/blob/master/lib/ncp.js
        var _this = this;
        var _copyPath = null;
        var _copyPathExists = false;
        series([
            task(function(flow) {
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
            task(function(flow) {
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
            }),
            task(function(flow) {
                _copyPath = new Path(intoPath.getAbsolutePath() + path.sep + _this.getName());
                _copyPath.exists(function(exists) {
                    _copyPathExists = exists;
                    flow.complete();
                });
            }),
            task(function(flow) {
                if (!_copyPathExists) {
                    _copyPath.createFile(false, function(error) {
                        flow.complete(error);
                    });
                } else {
                    _copyPath.isFile(function(error, isFile) {
                        if (!error) {
                            if (!isFile) {

                                // TODO BRN (QUESTION): If the fileCopyPath is not a file and overwrite is true, should we delete whatever is
                                // here and copy the file?

                                flow.error(new Error("Cannot copy to path '" + intoPath.getAbsolutePath() +
                                    "' because it is not a file."));
                            } else {
                                flow.complete();
                            }
                        } else {
                            flow.error(error);
                        }
                    });
                }
            }),
            task(function(flow) {
                if (overwrite || !_copyPathExists) {
                    var readStream = _this.createReadStream();
                    var writeStream = _copyPath.createWriteStream();
                    readStream.pipe(writeStream);
                    readStream.on('end', function() {
                        readStream.removeAllListeners();
                        writeStream.removeAllListeners();
                        flow.complete();
                    });
                    readStream.on('error', function(error) {
                        readStream.removeAllListeners();
                        writeStream.removeAllListeners();
                        flow.error(error);
                    });
                    writeStream.on('error', function(error) {
                        readStream.removeAllListeners();
                        writeStream.removeAllListeners();
                        flow.error(error);
                    });
                } else {
                    flow.complete();
                }
            })
        ]).execute(function(error) {
            callback(error, _copyPath);
        });
    },

    /**
     * @private
     * @param {Path} intoPath
     * @param {boolean} overwrite
     * @return {Path}
     */
    _copyFileSync: function(intoPath, overwrite) {

        // NOTE BRN: This copy file function copies a file INTO a folder. So the intoPath represents the folder we want
        // to copy the file INTO.

        if (!intoPath.existsSync()) {
            intoPath.createDirectorySync(true, "0777");
        }
        if (!intoPath.isDirectorySync()) {

            // NOTE BRN: If the intoPath is not a directory we don't perform a copy, event if overwrite is true.

            throw new Error("Cannot copy into path '" + intoPath.getAbsolutePath() + "' because it is not a " +
                "directory.");
        }
        var fileCopyPath = new Path(intoPath.getAbsolutePath() + path.sep + this.getName());
        var exists = fileCopyPath.existsSync();
        if (!exists) {
            fileCopyPath.createFileSync(false);
        } else if (!fileCopyPath.isFileSync()) {

            // TODO BRN (QUESTION): If the fileCopyPath is not a file and overwrite is true, should we delete whatever is
            // here and copy the file?

            throw new Error("Cannot copy to path '" + intoPath.getAbsolutePath() + "' because it is not a file.");
        }
        if (overwrite || !exists) {
            var BUF_LENGTH = 64 * 1024;
            var buffer = new Buffer(BUF_LENGTH);
            var fdRead = fs.openSync(srcFile, 'r');
            var fdWrite = fs.openSync(destFile, 'w');
            var bytesRead = 1;
            var position = 0;
            while (bytesRead > 0) {
                bytesRead = fs.readSync(fdRead, buffer, 0, BUF_LENGTH, position);
                fs.writeSync(fdWrite, buffer, 0, bytesRead);
                position += bytesRead;
            }
            fs.closeSync(fdRead);
            fs.closeSync(fdWrite);
        }
        return fileCopyPath;
    },

    /**
     * @private
     * @param {boolean} createParentDirectories
     * @param {string} mode
     * @param {?function(Error)} callback
     */
    _createDirectory: function(createParentDirectories, mode, callback) {
        var _this = this;
        series([
            task(function(flow) {
                if (createParentDirectories) {
                    _this.ensureParentDirectories(function(error) {
                        flow.complete(error);
                    });
                } else {
                    flow.complete();
                }
            }),
            task(function(flow) {
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
        series([
           task(function(flow) {
                if (createParentDirectories) {
                    _this.ensureParentDirectories("0777", function(error) {
                        flow.complete(error);
                    });
                } else {
                    flow.complete();
                }
            }),
            task(function(flow) {
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
        series([
            task(function(flow) {
                _this.isDirectory(function(error, isDirectory) {
                    if (!error) {
                        if (isDirectory) {
                            _this._deleteDirectory(recursive, function(error) {
                                flow.exit(error);
                            });
                        } else {
                            flow.complete();
                        }
                    } else {
                        flow.error(error);
                    }
                });
            }),
            task(function(flow) {
                _this.isFile(function(error, isFile) {
                    if (isFile) {
                        _this._deleteFile(function(error) {
                            flow.complete(error);
                        })
                    } else {
                        flow.error(new Error("Cannot delete path '" + _this.getAbsolutePath() + "' because it is an " +
                            "unknown type."));
                    }
                })
            })
        ]).execute([], callback);
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
        series([
            task(function(flow) {
                _this._readDirectory(function(error, pathArray) {
                    if (!error) {
                        childPathArray = pathArray;
                        flow.complete();
                    } else {
                        flow.error(error);
                    }
                });
            }),
            task(function(flow) {
                if (childPathArray.length > 0) {
                    if (recursive) {
                        each(childPathArray, function(boil, childPath) {
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
            task(function(flow) {
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
     * @private
     * @param {(string|Path)} intoPath
     * @param {?(boolean|function(Error))=} overwrite (defaults to false)
     * @param {?function(Error)} callback
     */
    _moveFile: function(intoPath, overwrite, callback) {
        //TODO BRN: Is there any difference in using fs.link on a directory vs a file?
        //ANSWER BRN: Link does not work on directories

        //TODO BRN: What happens if we try to create a link on to a location where a file already exists?
        //ANSWER BRN: An error is thrown Error: EEXIST, file already exists

        //TODO BRN: Implementation


        var _this = this;
        var toExists = false;
        series([
            task(function(flow) {
                _this.exists(function(exists) {
                    if (exists) {
                        flow.complete();
                    } else {
                        flow.error(new Error("Cannot move file '" + this.getAbsolutePath() + "' because it does" +
                            " not exist."));
                    }
                });
            }),
            task(function(flow) {
                intoPath.exists(function(exists) {
                    toExists = exists;
                    flow.complete();
                });
            }),
            task(function(flow) {
                if (toExists) {
                    if (overwrite) {
                        intoPath.delete(function(error) {
                            flow.complete(error);
                        });
                    } else {
                        flow.exit();
                    }
                } else {
                    flow.complete();
                }
            }),
            task(function(flow) {
                fs.link(_this.getAbsolutePath(), intoPath.getAbsolutePath(), function(error) {
                    if (error) {
                        error = new Error(error.message);
                    }
                    flow.complete(error);
                })
            }),
            task(function(flow) {
                fs.unlink(_this.getAbsolutePath(), function(error) {
                    //TODO BRN: What to do if the unlink fails? Should we undo the link created in the last task?
                    if (error) {
                        error = new Error(error.message);
                    }
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },

    /**
     * @private
     * @param {Path} intoPath
     * @param {boolean} overwrite (defaults to false)
     */
    _moveFileSync: function(intoPath, overwrite) {
        if (intoPath.existsSync()) {
            if (overwrite) {
                intoPath.deleteSync();
                fs.linkSync(this.getAbsolutePath(), intoPath.getAbsolutePath());
                fs.unlinkSync(this.getAbsolutePath());
            }
        } else {
            fs.linkSync(this.getAbsolutePath(), intoPath.getAbsolutePath());
            fs.unlinkSync(this.getAbsolutePath());
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
