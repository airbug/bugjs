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

//@Export('bugdelta.CalculatorResolver')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Map         = bugpack.require('Map');
    var Obj         = bugpack.require('Obj');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CalculatorResolver = Class.extend(Obj, {

        _name: "bugdelta.CalculatorResolver",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<Class, DeltaCalculator>}
             */
            this.classCalculatorMap     = new Map();

            /**
             * @private
             * @type {Map.<string, DeltaCalculator>}
             */
            this.dataTypeCalculatorMap  = new Map();

            /**
             * @private
             * @type {Map.<string, DeltaCalculator>}
             */
            this.interfaceCalculatorMap = new Map();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Class} _class
         * @param {DeltaCalculator} calculator
         */
        registerCalculatorForClass: function(_class, calculator) {
            this.classCalculatorMap.put(_class, calculator);
        },

        /**
         * @param {Interface} _interface
         * @param {DeltaCalculator} calculator
         */
        registerCalculatorForInterface: function(_interface, calculator) {
            this.interfaceCalculatorMap.put(_interface, calculator);
        },

        /**
         * @param {string} dataType
         * @param {DeltaCalculator} calculator
         */
        registerCalculatorForDataType: function(dataType, calculator) {
            this.dataTypeCalculatorMap.put(dataType, calculator);
        },

        /**
         * @param {*} value
         * @return {DeltaCalculator}
         */
        resolveCalculator: function(value) {
            if (TypeUtil.isObject(value) && TypeUtil.isFunction(value.getClass)) {
                var _class = value.getClass();
                if (this.classCalculatorMap.containsKey(_class)) {
                    return this.classCalculatorMap.get(_class);
                }
                var _superclass = _class.getSuperclass();
                while (_superclass) {
                    if (this.classCalculatorMap.containsKey(_superclass)) {
                        return this.classCalculatorMap.get(_superclass);
                    }
                    _superclass = _superclass.getSuperclass();
                }
                for (var i = 0, size = value.getClass().getInterfaces().length; i < size; i++) {
                    var _interface = value.getClass().getInterfaces()[i];
                    if (this.interfaceCalculatorMap.containsKey(_interface)) {
                        return this.interfaceCalculatorMap.get(_interface);
                    }
                }
            } else {
                var dataType = TypeUtil.toType(value);
                if (this.dataTypeCalculatorMap.containsKey(dataType)) {
                    return this.dataTypeCalculatorMap.get(dataType);
                }
            }
            return null;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugdelta.CalculatorResolver', CalculatorResolver);
});
