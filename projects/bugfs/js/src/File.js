//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('File')

//@Require('Class')
//@Require('Directory')
//@Require('List)'
//@Require('Obj')

var bugpack = require('bugpack');
var fs = require('fs');
var path = require('path');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('File');

var Class = bugpack.require('Class');
var Directory = bugpack.require('Directory');
var List = bugpack.require('List');
var Obj = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

//TODO BRN: Rewrite this class using the built in 'path' module

var File = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(absoluteFilePath) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.absoluteFilePath = absoluteFilePath;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getAbsolutePath: function() {
        return this.absoluteFilePath;
    },

    /**
     * @return {string}
     */
    getName: function() {
        return path.filename(this.getAbsolutePath());
    },

    /**
     * @param {File} toFile
     * @return {string}
     */
    getFilePathToAnotherFile: function(toFile) {

        //TODO BRN: WOW, stop being an idiot and use the built in 'path' module that already does all of this...

        var finalPath = '';
        var toFileDirectoryList = new List();
        var toFileDirectory = toFile.getParentDirectory();
        toFileDirectoryList.add(toFileDirectory);

        var currentDirectory = toFileDirectory;
        while (currentDirectory.hasParentDirectory()) {
            currentDirectory = currentDirectory.getParentDirectory();
            toFileDirectoryList.addAt(0, currentDirectory);
        }

        var fromFileDirectory = this.getParentDirectory();
        var commonDirectory = undefined;
        if (toFileDirectoryList.contains(fromFileDirectory)) {
            finalPath += './';
            commonDirectory = fromFileDirectory;
        } else {
            currentDirectory = fromFileDirectory;
            while (currentDirectory.hasParentDirectory()) {
                currentDirectory = currentDirectory.getParentDirectory();
                finalPath += '../';
                if (toFileDirectoryList.contains(currentDirectory)) {
                    commonDirectory = currentDirectory;
                    break;
                }
            }
        }
        var remainingToPath = toFile.getAbsolutePath().replace(commonDirectory.getAbsoluteDirectoryPath(), '');

        return finalPath + remainingToPath;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, File)) {
            return (value.getAbsolutePath() === this.getAbsolutePath());
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[File]" + Obj.hashCode(this.getAbsolutePath()));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    createFile: function() {

        // TODO BRN: We could speed this up here by not creating sync. We'd have to figure out what to do if two writes
        // were requested by the compiler.

        this.ensureFileDirectory();
        var absoluteFilePath = this.getAbsolutePath();
        fs.writeFileSync(absoluteFilePath, "");
    },

    /**
     *
     */
    deleteFile: function() {
        // TODO BRN: We could speed this up here by not removing sync. We'd have to figure out what to do if two writes
        // were requested by the compiler.

        var absoluteFilePath = this.getAbsolutePath();
        if (fs.existsSync(absoluteFilePath)) {
            fs.unlinkSync(absoluteFilePath);
        }
    },

    /**
     * @return {Directory}
     */
    getParentDirectory: function() {
        var absoluteFilePath = this.getAbsolutePath();
        var absoluteDirectoryPath = absoluteFilePath.substring(0, absoluteFilePath.lastIndexOf('/') + 1);
        return new Directory(absoluteDirectoryPath);
    },

    /**
     * @param {string} data
     */
    writeFile: function(data) {

        // TODO BRN: We could speed this up here by not writing sync. We'd have to figure out what to do if two writes
        // were requested by the compiler.

        fs.writeFileSync(this.getAbsolutePath(), data);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    ensureFileDirectory: function() {
        var directory = this.getParentDirectory();
        directory.createDirectory(true);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(File);
