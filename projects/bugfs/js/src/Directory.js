//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('Directory')

//@Require('Class')
//@Require('Obj')

var bugpack = require('bugpack');
var fs = require('fs');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('Directory');

var Class = bugpack.require('Class');
var Obj = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

//TODO BRN: Rewrite this class using the built in 'path' module    http://nodejs.org/api/path.html

var Directory = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(absoluteDirectoryPath) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.absoluteDirectoryPath = this.pathFix(absoluteDirectoryPath);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getAbsoluteDirectoryPath: function() {
        return this.absoluteDirectoryPath;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, Directory)) {
            return (value.getAbsoluteDirectoryPath() === this.getAbsoluteDirectoryPath());
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[Directory]" + Obj.hashCode(this.getAbsoluteDirectoryPath()));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    createDirectory: function(recursive) {
        if (!this.directoryExists()) {
            if (recursive) {
                if (this.hasParentDirectory()) {
                    var parentDirectory = this.getParentDirectory();
                    if (!parentDirectory.directoryExists()) {
                        parentDirectory.createDirectory(true);
                    }
                }
            }
            fs.mkdirSync(this.absoluteDirectoryPath);
        }
    },

    /**
     *
     */
    deleteDirectory: function() {
        if (this.directoryExists()) {
            fs.rmdirSync(this.absoluteDirectoryPath);
        }
    },

    /**
     * @return {boolean}
     */
    directoryExists: function() {
        return fs.existsSync(this.absoluteDirectoryPath);
    },

    /**
     * @return {Directory}
     */
    getParentDirectory: function() {
        if (this.hasParentDirectory()) {
            var absoluteDirectoryPath = this.getAbsoluteDirectoryPath();
            var parentDirectoryPath = absoluteDirectoryPath.substring(0,
                absoluteDirectoryPath.substr(0, absoluteDirectoryPath.length - 1).lastIndexOf('/'));
            return new Directory(parentDirectoryPath);
        }
        return undefined;
    },

    /**
     * @return {boolean}
     */
    hasParentDirectory: function() {
        var absoluteDirectoryPath = this.getAbsoluteDirectoryPath();
        return (absoluteDirectoryPath !== '/');
    },

    /**
     * @return {boolean}
     */
    isDirectoryEmpty: function() {
        var fileStringArray = fs.readdirSync(this.absoluteDirectoryPath);
        return (fileStringArray.length === 0);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * Make sure the path ends with '/'
     * @private
     * @param {string} path
     * @return {string}
     */
    pathFix: function(path) {
        if (path.length > 0) {
            if (path.substr(path.length - 1) !== '/') {
                path += '/';
            }
        } else {
            path += '/';
        }
        return path;
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(Directory);
