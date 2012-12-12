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

bugpack.declare('BugFs');

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
 * @param {boolean} recursive
 * @param {function(Error)} callback
 */
BugFs.copy = function(fromPath, intoPath, recursive, callback) {
    fromPath = TypeUtil.isString(fromPath) ? new Path(fromPath) : fromPath;
    fromPath.copy(intoPath, callback);
};

/**
 * @param {(string|Path)} fromPath
 * @param {(string|Path)} intoPath
 * @param {boolean} recursive
 */
BugFs.copySync = function(fromPath, intoPath, recursive) {
    fromPath = TypeUtil.isString(fromPath) ? new Path(fromPath) : fromPath;
    fromPath.copySync(intoPath);
};

/**
 * If the file already exists, it is NOT MODIFIED
 * @param {(string|Path)} filePath
 * @param {boolean} createParentDirectories
 * @param {function(Error)} callback
 */
BugFs.createFile = function(filePath, createParentDirectories, callback) {
    filePath = TypeUtil.isString(filePath) ? new Path(filePath) : filePath;
    filePath.createFile(createParentDirectories, callback);
};

/**
 * If the file already exists, it is NOT MODIFIED
 * @param {(string|Path)} filePath
 * @param {boolean} createParentDirectories
 */
BugFs.createFileSync = function(filePath, createParentDirectories) {
    filePath = TypeUtil.isString(filePath) ? new Path(filePath) : filePath;
    filePath.createFileSync(createParentDirectories);
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
 * @param {(string|Path)} fromPath
 * @param {(string|Path)} intoPath
 * @param {function(Error)} callback
 */
BugFs.move = function(fromPath, intoPath, callback) {
    fromPath = TypeUtil.isString(fromPath) ? new Path(fromPath) : fromPath;
    fromPath.move(intoPath, callback);
};

/**
 * @param {(string|Path)} fromPath
 * @param {(string|Path)} intoPath
 */
BugFs.moveSync = function(fromPath, intoPath) {
    fromPath = TypeUtil.isString(fromPath) ? new Path(fromPath) : fromPath;
    fromPath.moveSync(intoPath);
};

/**
 * @param {(string|Path)} filePath
 * @param {string} data
 * @param {string|function(Error)} encoding
 * @param {?function(Error)} callback
 */
BugFs.writeFile = function(filePath, data, encoding, callback) {
    filePath = TypeUtil.isString(filePath) ? new Path(filePath) : filePath;
    filePath.writeFile(data, encoding, callback);
};

/**
 * @param {(string|Path)} filePath
 * @param {string} data
 * @param {?string} encoding
 */
BugFs.writeFileSync = function(filePath, data, encoding) {
    filePath = TypeUtil.isString(filePath) ? new Path(filePath) : filePath;
    filePath.writeFileSync(data, encoding);
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(BugFs);
