//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('BugFs')

//@Require('Directory')
//@Require('File')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Path = bugpack.require('Path');
var TypeUtil = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugFs = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {(string|Path)} fromPath
 * @param {(string|Path)} intoPath
 * @param {?(boolean|function(Error))=} recursive (defaults to true)
 * @param {?(Path.SyncMode|function(Error))=} syncMode (defaults to Path.SyncMode.STOP)
 * @param {?function(Error, Path)} callback
 */
BugFs.copy = function(fromPath, intoPath, recursive, syncMode, callback) {
    fromPath = TypeUtil.isString(fromPath) ? new Path(fromPath) : fromPath;
    fromPath.copy(intoPath, recursive, syncMode, callback);
};

/**
 * @param {(string|Path)} fromPath
 * @param {(string|Path)} intoPath
 * @param {?boolean=} recursive
 * @param {?Path.SyncMode=} syncMode (defaults to Path.SyncMode.STOP)
 * @return {Path}
 */
BugFs.copySync = function(fromPath, intoPath, recursive, syncMode) {
    fromPath = TypeUtil.isString(fromPath) ? new Path(fromPath) : fromPath;
    return fromPath.copySync(intoPath, recursive, syncMode);
};

/**
 * @param {(string|Path)} fromPath
 * @param {(string|Path)} intoPath
 * @param {?(boolean|function(Error))=} recursive (defaults to true)
 * @param {?(Path.SyncMode|function(Error))=} syncMode (defaults to Path.SyncMode.STOP)
 * @param {?function(Error, Path)} callback
 */
BugFs.copyDirectory = function(fromPath, intoPath, recursive, syncMode, callback) {
    fromPath = TypeUtil.isString(fromPath) ? new Path(fromPath) : fromPath;
    fromPath.copyDirectory(intoPath, recursive, syncMode, callback);
};

/**
 * @param {(string|Path)} fromPath
 * @param {(string|Path)} intoPath
 * @param {?boolean=} recursive (defaults to true)
 * @param {?Path.SyncMode=} syncMode (defaults to Path.SyncMode.STOP)
 * @return {Path}
 */
BugFs.copyDirectorySync = function(fromPath, intoPath, recursive, syncMode) {
    fromPath = TypeUtil.isString(fromPath) ? new Path(fromPath) : fromPath;
    return fromPath.copyDirectorySync(intoPath, recursive, syncMode);
};

/**
 * @param {(string|Path)} fromPath
 * @param {(string|Path)} intoPath
 * @param {?(boolean|function(Error))=} recursive (defaults to true)
 * @param {?(Path.SyncMode|function(Error))=} syncMode (defaults to Path.SyncMode.STOP)
 * @param {?function(Error)} callback
 */
BugFs.copyDirectoryContents = function(fromPath, intoPath, recursive, syncMode, callback) {
    fromPath = TypeUtil.isString(fromPath) ? new Path(fromPath) : fromPath;
    fromPath.copyDirectoryContents(intoPath, recursive, syncMode, callback);
};

/**
 * @param {(string|Path)} fromPath
 * @param {(string|Path)} intoPath
 * @param {?boolean=} recursive (defaults to true)
 * @param {?Path.SyncMode=} syncMode (defaults to Path.SyncMode.STOP)
 */
BugFs.copyDirectoryContentsSync = function(fromPath, intoPath, recursive, syncMode) {
    fromPath = TypeUtil.isString(fromPath) ? new Path(fromPath) : fromPath;
    return fromPath.copyDirectorySync(intoPath, recursive, syncMode);
};

/**
 * @param {(string|Path)} fromPath
 * @param {(string|Path)} intoPath
 * @param {?(Path.SyncMode|function(Error))=} syncMode (defaults to Path.SyncMode.STOP)
 * @param {?function(Error, Path)} callback
 */
BugFs.copyFile = function(fromPath, intoPath, syncMode, callback) {
    fromPath = TypeUtil.isString(fromPath) ? new Path(fromPath) : fromPath;
    fromPath.copyFile(intoPath, syncMode, callback);
};

/**
 * @param {(string|Path)} fromPath
 * @param {(string|Path)} intoPath
 * @param {?Path.SyncMode=} syncMode (defaults to Path.SyncMode.STOP)
 * @return {Path}
 */
BugFs.copyFileSync = function(fromPath, intoPath, syncMode) {
    fromPath = TypeUtil.isString(fromPath) ? new Path(fromPath) : fromPath;
    return fromPath.copyFileSync(intoPath, syncMode);
};

/**
 * @param {(string|Path)} dirPath
 * @param {?(boolean|function(Error))=} createParentDirectories (defaults to true)
 * @param {?(string|function(Error))=} mode (defaults to '0777')
 * @param {?function(Error, Path)} callback
 */
BugFs.createDirectory = function(dirPath, createParentDirectories, mode, callback) {
    dirPath = TypeUtil.isString(dirPath) ? new Path(dirPath) : dirPath;
    dirPath.createDirectory(createParentDirectories, mode, callback);
};

/**
 * @param {(string|Path)} dirPath
 * @param {?boolean=} createParentDirectories
 * @param {?string=} mode
 * @return {Path}
 */
BugFs.createDirectorySync = function(dirPath, createParentDirectories, mode) {
    dirPath = TypeUtil.isString(dirPath) ? new Path(dirPath) : dirPath;
    return dirPath.createDirectorySync(createParentDirectories, mode);
};

/**
 * @param {(string|Path)} filePath
 * @param {?(boolean|function(Error))=} createParentDirectories (defaults to true)
 * @param {?function(Error, Path)} callback
 */
BugFs.createFile = function(filePath, createParentDirectories, callback) {
    filePath = TypeUtil.isString(filePath) ? new Path(filePath) : filePath;
    filePath.createFile(createParentDirectories, callback);
};

/**
 * @param {(string|Path)} filePath
 * @param {?boolean=} createParentDirectories (defaults to true)
 * @return {Path}
 */
BugFs.createFileSync = function(filePath, createParentDirectories) {
    filePath = TypeUtil.isString(filePath) ? new Path(filePath) : filePath;
    return filePath.createFileSync(createParentDirectories);
};

/**
 * @param {(string|Path)} filePath
 * @param {Object} options
 * @return {ReadStream}
 */
BugFs.createReadStream = function(filePath, options) {
    filePath = TypeUtil.isString(filePath) ? new Path(filePath) : filePath;
    return filePath.createReadStream(options);
};

/**
 * @param {(string|Path)} filePath
 * @param {Object} options
 * @return {WriteStream}
 */
BugFs.createWriteStream = function(filePath, options) {
    filePath = TypeUtil.isString(filePath) ? new Path(filePath) : filePath;
    return filePath.createWriteStream(options);
};

/**
 * @param {(string|Path)} aPath
 * @param {?(boolean|function(Error))=} recursive
 * @param {?function(Error)} callback
 */
BugFs.delete = function(aPath, recursive, callback) {
    aPath = TypeUtil.isString(aPath) ? new Path(aPath) : aPath;
    aPath.delete(recursive, callback);
};

/**
 * @param {(string|Path)} aPath
 * @param {?boolean=} recursive
 */
BugFs.deleteSync = function(aPath, recursive) {
    aPath = TypeUtil.isString(aPath) ? new Path(aPath) : aPath;
    aPath.deleteSync(recursive);
};

/**
 * @param {(string|Path)} dirPath
 * @param {?(boolean|function(Error))=} recursive (defaults to true)
 * @param {?function(Error)} callback
 */
BugFs.deleteDirectory = function(dirPath, recursive, callback) {
    dirPath = TypeUtil.isString(dirPath) ? new Path(dirPath) : dirPath;
    dirPath.deleteDirectory(recursive, callback);
};

/**
 * @param {(string|Path)} dirPath
 * @param {?boolean=} recursive
 */
BugFs.deleteDirectorySync = function(dirPath, recursive) {
    dirPath = TypeUtil.isString(dirPath) ? new Path(dirPath) : dirPath;
    dirPath.deleteDirectorySync(recursive);
};

/**
 * @param {(string|Path)} filePath
 * @param {?function(Error)} callback
 */
BugFs.deleteFile = function(filePath, callback) {
    filePath = TypeUtil.isString(filePath) ? new Path(filePath) : filePath;
    filePath.deleteFile(callback);
};

/**
 * @param {(string|Path)} filePath
 */
BugFs.deleteFileSync = function(filePath) {
    filePath = TypeUtil.isString(filePath) ? new Path(filePath) : filePath;
    filePath.deleteFileSync();
};

/**
 * @param {string} aPath
 * @param {?function(boolean)} callback
 */
BugFs.exists = function(aPath, callback) {
    aPath = TypeUtil.isString(aPath) ? new Path(aPath) : aPath;
    aPath.exists(callback);
};

/**
 * @param {string} aPath
 * @return {boolean}
 */
BugFs.existsSync = function(aPath) {
    aPath = TypeUtil.isString(aPath) ? new Path(aPath) : aPath;
    return aPath.existsSync();
};

/**
 * @param {string} pathString
 * @return {Path}
 */
BugFs.path = function(pathString) {
    return new Path(pathString);
};

/**
 * @param {(string|Path)} fromPath
 * @param {(string|Path)} intoPath
 * @param {?(Path.SyncMode|function(Error))=} syncMode (defaults to Path.SyncMode.STOP) 
 * @param {?function(Error)} callback
 */
BugFs.move = function(fromPath, intoPath, syncMode, callback) {
    fromPath = TypeUtil.isString(fromPath) ? new Path(fromPath) : fromPath;
    fromPath.move(intoPath, syncMode, callback);
};

/**
 * @param {(string|Path)} fromPath
 * @param {(string|Path)} intoPath
 * @param {?Path.SyncMode=} syncMode (defaults to Path.SyncMode.STOP)
 */
BugFs.moveSync = function(fromPath, intoPath, syncMode) {
    fromPath = TypeUtil.isString(fromPath) ? new Path(fromPath) : fromPath;
    fromPath.moveSync(intoPath, syncMode);
};

/**
 * @param {(string|Path)} aPath
 * @return {Path}
 */
BugFs.parentPath = function(aPath) {
    aPath = TypeUtil.isString(aPath) ? new Path(aPath) : aPath;
    return aPath.getParentPath();
};

/**
 * @param {(string|Path)} filePath
 * @param {?(string|function(Error, string))=} encoding
 * @param {function(Error, string)} callback
 */
BugFs.readFile = function(filePath, encoding, callback) {
    filePath = TypeUtil.isString(filePath) ? new Path(filePath) : filePath;
    filePath.readFile(encoding, callback);
};

/**
 * @param {(string|Path)} filePath
 * @param {?string=} encoding
 * @return {*}
 */
BugFs.readFileSync = function(filePath, encoding) {
    filePath = TypeUtil.isString(filePath) ? new Path(filePath) : filePath;
    return filePath.readFileSync(encoding);
};

/**
 * @param {(string|Path)} filePath
 * @param {string} data
 * @param {?(string|function(Error))=} encoding
 * @param {?function(Error)} callback
 */
BugFs.writeFile = function(filePath, data, encoding, callback) {
    filePath = TypeUtil.isString(filePath) ? new Path(filePath) : filePath;
    filePath.writeFile(data, encoding, callback);
};

/**
 * @param {(string|Path)} filePath
 * @param {string} data
 * @param {?string=} encoding
 */
BugFs.writeFileSync = function(filePath, data, encoding) {
    filePath = TypeUtil.isString(filePath) ? new Path(filePath) : filePath;
    filePath.writeFileSync(data, encoding);
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(BugFs);
