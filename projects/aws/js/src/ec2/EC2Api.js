//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('aws')

//@Export('EC2Api')

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var AWS = require('aws-sdk');
var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var Obj =                   bugpack.require('Obj');
var Map =                   bugpack.require('Map');
var TypeUtil =              bugpack.require('TypeUtil');
var AwsConfig =             bugpack.require('aws.AwsConfig');
var S3Object =              bugpack.require('aws.S3Object');
var BugFlow =               bugpack.require('bugflow.BugFlow');
var BugFs =                 bugpack.require('bugfs.BugFs');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $if = BugFlow.$if;
var $series = BugFlow.$series;
var $task = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EC2Api = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(awsConfig, params) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AwsConfig}
         */
        this.awsConfig = awsConfig;

        /**
         * @private
         * @type {boolean}
         */
        this.initialized = false;

        /**
         * @private
         * @type {AWS.EC2}
         */
        this.ec2 = null;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {S3Bucket} s3Bucket
     * @param {function(Error, boolean)} callback
     */
    canAccessBucket: function(s3Bucket, callback) {
        this.initialize();
        this.headBucket(s3Bucket, function(error, data) {
            if (error) {
                //TEST
                //TODO BRN: What other codes?
                console.log(error);
                callback(null, false);
            } else {
                callback(null, true);
            }
        });
    },

    /**
     * @param {S3Bucket} s3Bucket
     * @param {{
        *   acl: string,
     *   createBucketConfiguration: Object,
     *   locationConstraint: string,
     *   grantFullControl: string,
     *   grantRead: string,
     *   grantReadACP: string,
     *   grantWrite: string,
     *   grantWriteACP: string
     * }} options
     * @param {function(Error, data} callback
     */
    createBucket: function(s3Bucket, options, callback) {
        var params = {
            Bucket: s3Bucket.getName(),
            ACL: options.acl,
            CreateBucketConfiguration: options.createBucketConfiguration,
            LocationConstraint: options.locationConstraint,
            GrantRead: options.grantRead,
            GrantReadACP: options.grantReadACP,
            GrantWrite: options.grantWrite,
            GrantWriteACP: options.grantWriteACP
        };
        this.s3.client.createBucket(params, callback)
    },

    /**
     * @param {S3Bucket} s3Bucket
     * @param {function(Error, boolean)} callback
     */
    doesBucketExist: function(s3Bucket, callback) {
        this.initialize();
        this.headBucket(s3Bucket, function(error, data) {
            if (error) {
                if (error.code === 'NotFound') {
                    callback(null, false);
                } else {
                    //TODO BRN: What other codes?
                    console.log(error);
                    throw new Error("Something else happened.");
                }
            } else {
                callback(null, true);
            }
        });
    },

    /**
     * @param {S3Bucket} s3Bucket
     * @param {function(Error)} callback
     */
    ensureBucket: function(s3Bucket, callback) {
        var _this = this;
        this.initialize();
        $if (function(flow) {
                _this.doesBucketExist(s3Bucket, function(error, exists) {
                    if (!error) {
                        flow.assert(!exists);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $task(function(flow) {
                _this.createBucket(s3Bucket, function(error, data) {
                    flow.complete(error, data);
                });
            })
        ).execute(callback);
    },

    /**
     * @param {S3Object} s3Object
     * @param {S3Bucket} s3Bucket
     * @return {string}
     */
    getObjectURL: function(s3Object, s3Bucket) {
        return "https://s3.amazonaws.com/" + s3Bucket.getName() + "/" + s3Object.getKey();
    },

    /**
     * @param {S3Bucket} s3Bucket
     * @param {function(Object, Object)} callback
     */
    headBucket: function(s3Bucket, callback) {
        this.initialize();
        var params = {
            Bucket: s3Bucket.getName()
        };
        this.s3.client.headBucket(params, callback);
    },

    /**
     * @param {Path} filePath
     * @param {S3Bucket} s3Bucket
     * @param {{
        *     acl: ?string,
     *     grantFullControl: ?string,
     *     grantRead: ?string,
     *     grantReadACP: ?string,
     *     grantWriteACP: ?string,
     *     storageClass: ?string
     * }} options
     * @param {function(Error, S3Object)} callback
     */
    putFile: function(filePath, s3Bucket, options, callback) {
        var _this = this;
        var fileData = null;
        var s3Object = null;
        this.initialize();
        $if (function(flow) {
                _this.canAccessBucket(s3Bucket, function(error, canAccess) {
                    if (!error) {
                        flow.assert(canAccess);
                    } else {
                        flow.error(error);
                    }
                });
            },
            $series([
                $task(function(flow) {
                    filePath.readFile(function(error, data) {
                        if (!error) {
                            fileData = data;
                            flow.complete();
                        } else {
                            flow.error(error);
                        }
                    });
                }),
                $task(function(flow) {
                    s3Object = new S3Object({
                        body: fileData,
                        key: filePath.getName(),
                        contentType: _this.autoDiscoverContentType(filePath)
                    });
                    _this.putObject(s3Object, s3Bucket, options, function(error) {
                        flow.complete(error);
                    });
                })
            ])
        ).$else(
            $task(function(flow) {
                flow.error(new Error("Cannot access bucket '" + s3Bucket.getName() + "'"));
            })
        ).execute(function(error) {
                if (!error) {
                    callback(null, s3Object);
                } else {
                    callback(error);
                }
            });
    },

    /**
     * @private
     * @param {S3Object} s3Object
     * @param {S3Bucket} s3Bucket
     * @param {{
        *     acl: ?string
     *     grantFullControl: ?string,
     *     grantRead: ?string,
     *     grantReadACP: ?string,
     *     grantWriteACP: ?string,
     *     storageClass: ?string
     * }} options
     * @param {function(Object, Object)} callback
     */
    putObject: function(s3Object, s3Bucket, options, callback) {
        var params = {
            Body: s3Object.getBody(),
            Bucket: s3Bucket.getName(),
            Key: s3Object.getKey()
        };

        if (options.acl) {
            params.ACL = options.acl;
        }
        if (s3Object.getCacheControl()) {
            params.CacheControl = s3Object.getCacheControl();
        }
        if (s3Object.getContentDisposition()) {
            params.ContentDisposition = s3Object.getCacheControl();
        }
        if (s3Object.getContentEncoding()) {
            params.ContentEncoding = s3Object.getContentEncoding();
        }
        if (s3Object.getContentLanguage()) {
            params.ContentLanguage = s3Object.getContentLanguage();
        }
        if (s3Object.getContentType()) {
            params.ContentType = s3Object.getContentType();
        }
        if (s3Object.getExpires()) {
            params.Expires = s3Object.getExpires();
        }
        if (options.grantFullControl) {
            params.GrantFullControl = options.grantFullControl;
        }
        if (options.grantRead) {
            params.GrantRead = options.grantRead;
        }
        if (options.grantReadACP) {
            params.GrantReadACP = options.grantReadACP;
        }
        if (options.grantWriteACP) {
            params.GrantWriteACP = options.grantWriteACP;
        }
        if (s3Object.getMetaData()) {
            params.MetaData = s3Object.getMetaData();
        }
        if (s3Object.getServerSideEncryption()) {
            params.ServerSideEncryption = s3Object.getServerSideEncryption();
        }
        if (options.storageClass) {
            params.StorageClass = options.storageClass;
        }
        if (s3Object.getWebsiteRedirectLocation()) {
            params.WebsiteRedirectLocation = s3Object.getWebsiteRedirectLocation();
        }
        this.s3.client.putObject(params, callback);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Path} filePath
     * @return {string}
     */
    autoDiscoverContentType: function(filePath) {
        var extName = filePath.getExtName();
        var contentType = S3Api.extToContentType[extName];
        if (!contentType) {
            contentType = 'binary/octet-stream';
        }
        return contentType;
    },

    /**
     * @private
     */
    initialize: function() {
        if (!this.initialized) {
            this.initialized = true;
            AWS.config.update(this.awsConfig.toAWSObject());
            this.ec2 = new AWS.EC2();
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aws.EC2Api', EC2Api);
