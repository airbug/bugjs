//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugdispose.GarbageDisposal')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('ReferenceGraph')
//@Require('bugdispose.IDisposable')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var Obj                 = bugpack.require('Obj');
    var ReferenceGraph      = bugpack.require('ReferenceGraph');
    var IDisposable         = bugpack.require('bugdispose.IDisposable');
    var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var module              = ModuleAnnotation.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var GarbageDisposal = Class.extend(Obj, {

        _name: "bugdispose.GarbageDisposal",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.graphValid         = true;

            /**
             * @private
             * @type {ReferenceGraph}
             */
            this.referenceGraph     = new ReferenceGraph();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {ReferenceGraph}
         */
        getReferenceGraph: function() {
            return this.referenceGraph;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {IDisposable} disposableRoot
         */
        addDisposableRoot: function(disposableRoot) {
            if (Class.doesImplement(disposableRoot, IDisposable)) {
                this.referenceGraph.addRootValue(disposableRoot);
            } else {
                throw new Exception("IllegalArgument", {}, "parameter 'disposableRoot' must implement IDisposable");
            }
        },

        /**
         * @param {IDisposable} disposable
         */
        addDisposable: function(disposable) {
            if (Class.doesImplement(disposable, IDisposable)) {
                var result = this.referenceGraph.addValue(disposable);
                if (result) {
                    this.invalidateGraph();
                }
            } else {
                throw new Exception("IllegalArgument", {}, "parameter 'disposable' must implement IDisposable");
            }
        },

        /**
         * @param {IDisposable} fromDisposable
         * @param {IDisposable} toDisposable
         */
        addReference: function(fromDisposable, toDisposable) {
            this.addDisposable(fromDisposable);
            this.addDisposable(toDisposable);
            var result = this.referenceGraph.addReference(fromDisposable, toDisposable);
            if (result) {
                this.invalidateGraph();
            }
        },

        /**
         * @param {IDisposable} disposable
         */
        removeDisposable: function(disposable) {
            var result = this.referenceGraph.removeValue(disposable);
            if (result) {
                this.invalidateGraph();
            }
        },

        /**
         * @param {IDisposable} fromDisposable
         * @param {IDisposable} toDisposable
         */
        removeReference: function(fromDisposable, toDisposable) {
            var result = this.referenceGraph.removeReference(fromDisposable, toDisposable);
            if (result) {
                this.invalidateGraph();
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {IDisposable} disposable
         */
        disposeOfDisposable: function(disposable) {
            disposable.dispose();
            this.removeDisposable(disposable);
        },

        /**
         * @private
         */
        invalidateGraph: function() {
            this.graphValid = false;
            this.startValidationTimeout();
        },

        /**
         * @private
         */
        startValidationTimeout: function() {
            var _this = this;
            if (!this.timeoutId) {
                this.timeoutId = setTimeout(function() {
                    _this.timeoutId = null;
                    _this.validateGraph();
                }, 0);
            }
        },

        /**
         * @private
         */
        validateGraph: function() {
            if (!this.graphValid) {
                var _this           = this;
                this.graphValid     = true;
                while (this.referenceGraph.getUnreferencedValues().getCount() > 0) {
                    var unreferencedDisposables = this.referenceGraph.getUnreferencedValues().clone();
                    unreferencedDisposables.forEach(function (disposable) {
                        _this.disposeOfDisposable(disposable);
                    });
                }
            }
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(GarbageDisposal).with(
        module("garbageDisposal")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugdispose.GarbageDisposal', GarbageDisposal);
});
