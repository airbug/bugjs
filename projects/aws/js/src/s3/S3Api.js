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

//@Export('aws.S3Api')

//@Require('Bug')
//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
//@Require('aws.AwsConfig')
//@Require('aws.S3Object')
//@Require('Flows')
//@Require('bugfs.BugFs')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var AWS                 = require('aws-sdk');
    var zlib                = require('zlib');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug                 = bugpack.require('Bug');
    var Class               = bugpack.require('Class');
    var Map                 = bugpack.require('Map');
    var Obj                 = bugpack.require('Obj');
    var Set                 = bugpack.require('Set');
    var TypeUtil            = bugpack.require('TypeUtil');
    var AwsConfig           = bugpack.require('aws.AwsConfig');
    var S3Object            = bugpack.require('aws.S3Object');
    var Flows             = bugpack.require('Flows');
    var BugFs               = bugpack.require('bugfs.BugFs');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $forEachParallel    = Flows.$forEachParallel;
    var $if                 = Flows.$if;
    var $iterableParallel   = Flows.$iterableParallel;
    var $series             = Flows.$series;
    var $task               = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var S3Api = Class.extend(Obj, {

        _name: "aws.S3Api",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {AwsConfig} awsConfig
         */
        _constructor: function(awsConfig) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
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
             * @type {AWS.S3}
             */
            this.s3 = null;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {S3Bucket} s3Bucket
         * @param {function(Error, boolean)} callback
         */
        canAccessBucket: function(s3Bucket, callback) {
            this.initialize();
            this.headBucket(s3Bucket, function(error, data) {
                if (error) {
                    //TODO BRN: What other codes?
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
            this.s3.createBucket(params, callback)
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
            this.s3.headBucket(params, callback);
        },

        /**
         *
         * @param directoryPath
         * @param s3Bucket
         * @param options
         * @param callback
         */
        putDirectory: function(directoryPath, s3Bucket, options, callback) {
            var _this           = this;
            var fileData        = null;
            var s3Object        = null;
            var filePathSet     = null;
            if (TypeUtil.isFunction(options)) {
                callback    = options;
                options     = null;
            }
            if (!TypeUtil.isObject(options)) {
                options     = {};
            }

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
                        _this.buildFilePathSet(directoryPath, function(throwable, returnedFilePathSet) {
                            if (!throwable) {
                                filePathSet = returnedFilePathSet;
                            }
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        $iterableParallel(filePathSet, function(flow, filePath) {
                            var contentType = _this.autoDiscoverContentType(filePath);
                            var gzipped = false;
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
                                    if (options.gzip) {
                                        if (contentType === "text/css" || contentType === "application/x-javascript" || contentType === "application/json") {
                                            zlib.gzip(fileData, function(error, gzipData) {
                                                if (!error) {
                                                    gzipped = true;
                                                    fileData = gzipData;
                                                }
                                                flow.complete(error);
                                            });
                                        } else {
                                            flow.complete();
                                        }
                                    } else {
                                        flow.complete();
                                    }
                                }),
                                $task(function(flow) {
                                    var s3Key = "";
                                    if (options.base) {
                                        s3Key += options.base + "/";
                                    }
                                    s3Key += directoryPath.getRelativePath(filePath);

                                    s3Object = new S3Object({
                                        body: fileData,
                                        key: s3Key,
                                        contentType: contentType,
                                        cacheControl: options.cacheControl
                                    });
                                    if (gzipped) {
                                        s3Object.setContentEncoding(S3Api.ContentEncoding.GZIP);
                                    }
                                    if (options.encrypt) {
                                        s3Object.setServerSideEncryption("AES256");
                                    }
                                    _this.putObject(s3Object, s3Bucket, options, function(error) {
                                        flow.complete(error);
                                    });
                                })
                            ]).execute(function(throwable) {
                                flow.complete(throwable);
                            });
                        }).execute(function(throwable) {
                            flow.complete(throwable);
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
         * @param {Path} filePath
         * @param {string} s3Key
         * @param {string} contentType
         * @param {S3Bucket} s3Bucket
         * @param {{
         *     acl: ?string,
         *     base: ?string,
         *     encrypt: ?boolean,
         *     grantFullControl: ?string,
         *     grantRead: ?string,
         *     grantReadACP: ?string,
         *     grantWriteACP: ?string,
         *     gzip: ?boolean,
         *     storageClass: ?string
         * }} options
         * @param {function(Throwable, S3Object=)} callback
         */
        putFile: function(filePath, s3Key, contentType, s3Bucket, options, callback) {
            var _this = this;
            var fileData = null;
            var s3Object = null;
            if (TypeUtil.isFunction(options)) {
                callback = options;
                options = null;
            }
            if (!TypeUtil.isObject(options)) {
                options = {};
            }
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
                        if (options.gzip) {
                            zlib.gzip(fileData, function(error, gzipData) {
                                if (!error) {
                                    fileData = gzipData;
                                }
                                flow.complete(error);
                            });
                        } else {
                            flow.complete();
                        }
                    }),
                    $task(function(flow) {
                        if (!contentType) {
                            contentType = _this.autoDiscoverContentType(filePath);
                        }
                        if (options.base) {
                            s3Key = options.base + "/" + s3Key;
                        }
                        s3Object = new S3Object({
                            body: fileData,
                            key: s3Key,
                            contentType: contentType,
                            cacheControl: options.cacheControl
                        });
                        if (options.gzip) {
                            s3Object.setContentEncoding(S3Api.ContentEncoding.GZIP);
                        }
                        if (options.encrypt) {
                            s3Object.setServerSideEncryption("AES256");
                        }
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
            if (TypeUtil.isFunction(options)) {
                callback = options;
                options = null;
            }
            if (!TypeUtil.isObject(options)) {
                options = {};
            }
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
            this.s3.putObject(params, callback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
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
                this.s3 = new AWS.S3();
            }
        },

        /**
         * @private
         * @param {Path} directoryPath
         * @param {function(Throwable, Set.<Path>=)} callback
         */
        buildFilePathSet: function(directoryPath, callback) {
            var _this = this;
            var filePathSet = new Set();
            directoryPath.readDirectory(function(throwable, paths) {
                if (!throwable) {
                    $forEachParallel(paths, function(flow, path) {
                        $if (function(flow) {
                                path.isDirectory(function(throwable, result) {
                                    if (!throwable) {
                                        flow.assert(result);
                                    } else {
                                        flow.error(throwable);
                                    }
                                });
                            },
                            $task(function(flow) {
                                _this.buildFilePathSet(path, function(throwable, returnedFilePathSet) {
                                    if (!throwable) {
                                        filePathSet.addAll(returnedFilePathSet);
                                    }
                                    flow.complete(throwable);
                                });
                            })
                        ).$elseIf(function(flow) {
                                path.isFile(function(throwable, result) {
                                    if (!throwable) {
                                        flow.assert(result);
                                    } else {
                                        flow.error(throwable);
                                    }
                                });
                            },
                            $task(function(flow) {
                                filePathSet.add(path);
                                flow.complete();
                            })
                        ).$else(
                            $task(function(flow) {
                                flow.error(new Bug("UnsupportedFileType", {}, "unsupported path type found at '" + path.getAbsolutePath() + "'"));
                            })
                        ).execute(function(throwable) {
                            flow.complete(throwable);
                        });
                    }).execute(function(throwable) {
                        if (!throwable) {
                            callback(null, filePathSet);
                        } else {
                            callback(throwable);
                        }
                    });
                } else {
                    callback(throwable);
                }
            })
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    //TODO BRN: This doesn't belong here. Needs to be put in to a library file.
    /**
     * @static
     * @type {Object}
     */
    S3Api.extToContentType = {
        ".css": "text/css",
        ".gif": "image/gif",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".js": "application/x-javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".tgz": "application/x-compressed"
    };

    /**
     * @static
     * @enum {string}
     */
    S3Api.ContentEncoding = {
        GZIP: "gzip"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('aws.S3Api', S3Api);
});
