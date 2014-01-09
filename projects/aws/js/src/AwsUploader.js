//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('aws')

//@Export('AwsUploader')

//@Require('Class')
//@Require('Obj')
//@Require('aws.AwsConfig')
//@Require('aws.S3Api')
//@Require('aws.S3Bucket')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('bugfs.Path')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var AWS                 = require('aws-sdk');
var bugpack             = require('bugpack').context();


// -------------------------------------------------------------------------------
// Bugpack
// -------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var AwsConfig           = bugpack.require('aws.AwsConfig');
var S3Api               = bugpack.require('aws.S3Api');
var S3Bucket            = bugpack.require('aws.S3Bucket');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var BugFs               = bugpack.require('bugfs.BugFs');
var Path                = bugpack.require('bugfs.Path');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $forEachParallel    = BugFlow.$forEachParallel;
var $if                 = BugFlow.$if;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AwsUploader = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(propertiesFilePath) {

        this._super();

        // -------------------------------------------------------------------------------
        // Private Properties
        // -------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.isBucketEnsured        = null;

        /**
         * @private
         * @type {string}
         */
        this.propertiesFilePath     = propertiesFilePath;

        /**
         * @private
         * @type {{
         *      awsConfig: {
         *          accessKeyId: string,
         *          region: string,
         *          secretAccessKey: string
         *      },
         *      sourcePaths: Array.<string>,
         *      local-bucket: string,
         *      bucket: string,
         *      options: {*}
         *  }}
         */
        this.props                  = null;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @returns {{
     *      awsConfig: {
     *          accessKeyId: string,
     *          region: string,
     *          secretAccessKey: string
     *      },
     *      sourcePaths: Array.<string>,
     *      local-bucket: string,
     *      bucket: string,
     *      options: {*}
     *  }}
     */
    getProps: function() {
        return this.props;
    },

    /**
     * @param {function(error)=} callback
     */
    initialize: function(callback) {
        console.log('AwsUploader initializing...');
        var _this = this;
        var propertiesFilePath = this.propertiesFilePath;
        var callback = callback || function() {};

        $series([
            $task(function(flow) {
                try {
                    _this.isBucketEnsured        = false;
                    _this.props                  = JSON.parse(BugFs.readFileSync(propertiesFilePath));
                } catch (error) {
                    flow.error(error);
                } finally {
                    flow.complete();
                }
            }),
            // Synchronize ensure bucket function
            $task(function(flow) {
                _this.s3EnsureBucket(function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(error) {
            if (!error) {
                console.log('AwsUploader successfully initialized');
            } else {
                console.log('AwsUploader failed to initialize');
            }
            callback(error);
        });
    },

    /**
     * @param {string} outputFilePath
     * @param {string} s3Key
     * @param {string} contentType
     * @param {function(error, S3Object)} callback
     */
    upload: function(outputFilePath, s3Key, contentType, callback) {
        var _this = this;
        var returnedS3Object = null;
        $series([
            $task(function(flow) {
                if (!_this.isBucketEnsured) {
                    _this.s3EnsureBucket(function(error) {
                        flow.complete(error);
                    });
                } else {
                    flow.complete();
                }
            }),
            $task(function(flow) {
                _this.s3PutFile(outputFilePath, s3Key, contentType, function(error, s3Object) {
                    returnedS3Object = s3Object;
                    if (!error) {
                        BugFs.deleteFile(outputFilePath, function() {
                            if (!error) {
                                  console.log('File', outputFilePath, 'successfully removed');
                            }
                            flow.complete(error);
                        });
                    } else {
                        flow.error(error);
                    }
                });
            })
        ]).execute(function(throwable) {
            if (throwable) {
                callback(throwable, undefined);
            } else {
                callback(undefined, returnedS3Object);
            }
        });
    },

    /**
     * @param {string} outputDirectoryPath
     * @param {function(error)} callback
     */
    uploadEach: function(outputDirectoryPath, callback) {
        var _this = this;

        $series([
            $task(function(flow) {
                if (!_this.isBucketEnsured) {
                    _this.s3EnsureBucket(function(error) {
                        flow.complete(error);
                    });
                } else {
                    flow.complete();
                }
            }),
            $task(function(flow) {
                BugFs.readDirectory(outputDirectoryPath, function(error, files) {
                    if (error) {
                        flow.error(error);
                    } else if (files.length === 0) {
                        console.log("There are no files to upload in", outputDirectoryPath);
                        flow.complete();
                    } else if (files.length > 0) {
                        $forEachParallel(files, function(flow, file) {
                            var outputFilePath = file.givenPath;
                            var filePath = new Path(outputFilePath);
                            _this.upload(outputFilePath, filePath.getName(), null, function(error) {
                                flow.complete(error);
                            });
                        }).execute(function(error) {
                            if (!error) {
                                console.log("Successfully uploaded each file in", outputDirectoryPath);
                            }
                            flow.complete(error);
                        });
                    }
                });
            })
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

     /**
      * @private
      * @param {function(Error)} callback
      */
     s3EnsureBucket: function(callback) {
        var _this = this;
        var props = this.props;
        var awsConfig = new AwsConfig(props.awsConfig);
        var s3Bucket = new S3Bucket({
            name: props.bucket || props["local-bucket"]
        });
        var s3Api = new S3Api(awsConfig);
        s3Api.ensureBucket(s3Bucket, function(error) {
            var bucketName = s3Bucket.getName();
            if (!error) {
                console.log("Ensured bucket '" + bucketName + "' exists");
                _this.isBucketEnsured = true;
                callback(null, bucketName);
            } else {
                callback(error, bucketName);
            }
        });
     },

     /**
      * @private
      * @param {string} file
      * @param {string} s3Key
      * @param {string} contentType
      * @param {function(Error, S3Object)} callback
      */
     s3PutFile: function(file, s3Key, contentType, callback) {
         var props = this.props;
         var awsConfig = new AwsConfig(props.awsConfig);
         var filePath = new Path(file);
         var s3Bucket = new S3Bucket({
             name: props.bucket || props["local-bucket"]
         });
         var options = props.options || {acl: ''}; // Test this change
         var s3Api = new S3Api(awsConfig);
         var returnedS3Object = null;

         $if(function(flow) {
                filePath.exists(function(exists) {
                    flow.assert(exists);
                });
            },
            $task(function(flow) {
                s3Api.putFile(filePath, s3Key, contentType, s3Bucket, options, function(error, s3Object) {
                    returnedS3Object = s3Object;
                    if (!error) {
                        console.log("Successfully uploaded file to S3 '" + s3Api.getObjectURL(s3Object, s3Bucket) + "'");
                        // _this.registerURL(filePath, s3Api.getObjectURL(s3Object, s3Bucket));
                        flow.complete();
                    } else {
                        console.log("s3Api.putFile Error");
                        flow.error(error);
                    }
                });
            })
        ).$else(
            $task(function(flow) {
                flow.error(new Error("Cannot find file '" + filePath.getAbsolutePath() + "'"));
            })
        ).execute(function(throwable) {
             if (throwable) {
                 callback(throwable, undefined);
             } else {
                 callback(undefined, returnedS3Object);
             }
        });
    }
});


// -------------------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------------------

bugpack.export('aws.AwsUploader', AwsUploader);
