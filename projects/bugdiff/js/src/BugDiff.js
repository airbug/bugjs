/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugdiff may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugdiff.BugDiff')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var BugDiff = Class.extend(Obj, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} a
         * @param {string} b
         */
        _constructor: function(a, b) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.a          = a;

            /**
             * @private
             * @type {string}
             */
            this.b              = b;

            this.m              = a.length;
            this.n              = b.length;
            this.reverse        = false;
            this.editDistance   = null;
            this.offset         = this.m + 1;
            this.path           = [];
            this.pathPosition   = [];
            this.ses            = [];
            this.lcs            = "";

            var tmp1;
            var tmp2;

            if (this.m >= this.n) {
                tmp1    = this.a;
                tmp2    = this.m;
                this.a       = this.b;
                this.b       = tmp1;
                this.m       = this.n;
                this.n       = tmp2;
                this.reverse = true;
            }
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getA: function() {
            return this.a;
        },

        /**
         * @return {string}
         */
        getB: function() {
            return this.b;
        },

        /**
         * @return {null|number}
         */
        getEditdistance : function () {
            return this.editDistance;
        },

        getlcs : function () {
            return this.lcs;
        },
        getses : function () {
            return this.ses;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        compose : function () {
            var delta;
            var size;
            var fp;
            var p;
            var r;
            var epc;
            var i;
            var k;

            delta  = this.n - this.m;
            size   = this.m + this.n + 3;
            fp     = {};
            for (i = 0; i < size; ++i) {
                fp[i] = -1;
                this.path[i] = -1;
            }
            p = -1;
            do {
                ++p;
                for (k =- p;k <= delta - 1; ++k) {
                    fp[k + this.offset] = this.snake(k, fp[k - 1 + this.offset] + 1, fp[k+ 1 + this.offset]);
                }
                for (k = delta + p; k >= delta + 1; --k) {
                    fp[k + this.offset] = this.snake(k, fp[k - 1 + this.offset] + 1, fp[k + 1 + this.offset]);
                }
                fp[delta + this.offset] = this.snake(delta, fp[delta - 1 + this.offset] + 1, fp[delta + 1 + this.offset]);
            } while (fp[delta + this.offset] !== this.n);

            this.editDistance = delta + 2 * p;

            r = this.path[delta + this.offset];

            epc  = [];
            while (r !== -1) {
                epc[epc.length] = new P(this.pathPosition[r].x, this.pathPosition[r].y, null);
                r = this.pathPosition[r].k;
            }
            this.recordseq(epc);
        },

        snake: function (k, p, pp) {
            var r, x, y;
            if (p > pp) {
                r = this.path[k-1+this.offset];
            } else {
                r = this.path[k+1+this.offset];
            }

            y = Math.max(p, pp);
            x = y - k;
            while (x < this.m && y < this.n && this.a[x] === this.b[y]) {
                ++x;
                ++y;
            }

            this.path[k+this.offset] = this.pathPosition.length;
            this.pathPosition[this.pathPosition.length] = new P(x, y, r);
            return y;
        },

        recordseq: function (epc) {
            var x_idx, y_idx, px_idx, py_idx, i;
            x_idx  = y_idx  = 1;
            px_idx = py_idx = 0;
            for (i=epc.length-1;i>=0;--i) {
                while(px_idx < epc[i].x || py_idx < epc[i].y) {
                    if (epc[i].y - epc[i].x > py_idx - px_idx) {
                        if (this.reverse) {
                            this.ses[this.ses.length] = new seselem(this.b[py_idx], BugDiff.SES_DELETE);
                        } else {
                            this.ses[this.ses.length] = new seselem(this.b[py_idx], BugDiff.SES_ADD);
                        }
                        ++y_idx;
                        ++py_idx;
                    } else if (epc[i].y - epc[i].x < py_idx - px_idx) {
                        if (this.reverse) {
                            this.ses[this.ses.length] = new seselem(this.a[px_idx], BugDiff.SES_ADD);
                        } else {
                            this.ses[this.ses.length] = new seselem(this.a[px_idx], BugDiff.SES_DELETE);
                        }
                        ++x_idx;
                        ++px_idx;
                    } else {
                        this.ses[this.ses.length] = new seselem(this.a[px_idx], BugDiff.SES_COMMON);
                        this.lcs += this.a[px_idx];
                        ++x_idx;
                        ++y_idx;
                        ++px_idx;
                        ++py_idx;
                    }
                }
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {number}
     */
    BugDiff.SES_DELETE     = -1;

    /**
     * @static
     * @const {number}
     */
    BugDiff.SES_COMMON     = 0;

    /**
     * @static
     * @const {number}
     */
    BugDiff.SES_ADD        = 1;


    //TODO BRN: Move these to their own classes
    var P = function (x, y, k) {
        return {
            'x' : x,
            'y' : y,
            'k' : k
        };
    };

    var seselem = function (elem, t) {
        return {
            'elem' : elem,
            't'    : t
        };
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugdiff.BugDiff', BugDiff);
});
