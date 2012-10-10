//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/Annotate').annotate;
var Class = require('../../lib/Class');
var IHashCode = require('../../lib/IHashCode');
var Interface = require('../../lib/Interface');
var Obj = require('../../lib/Obj');
var TypeUtil = require('../../lib/TypeUtil');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var ClassTests = {

    /**
     *
     */
    classExtendObjTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var NewClass = Class.extend(Obj, {
            someTestFunction1: function() {

            },
            someTestFunction2: function() {

            }
        });
        var instance = new NewClass();


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertTrue(TypeUtil.isFunction(NewClass.prototype.someTestFunction1),
            "Assert function added to class is function and is present in class prototype");
        this.assertTrue(TypeUtil.isFunction(NewClass.prototype.someTestFunction2),
            "Assert second function added to class is function and is present in class prototype");
        this.assertTrue(TypeUtil.isFunction(instance.someTestFunction1),
            "Assert function added to class is present in class instance");
        this.assertTrue(TypeUtil.isFunction(instance.someTestFunction2),
            "Assert second function added to class is present in class instance");
        this.assertTrue(Class.doesExtend(instance, Obj),
            "Assert instance of new class extends base level Object class");
        this.assertTrue(Class.doesImplement(instance, IHashCode),
            "Assert instance of new class implements IHashCode");

    }).with('@Test("Class extend Obj test")'),

    /**
     *
     */
    classExtendTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var ParentClass = Class.extend(Obj, {
            someTestFunction1: function() {

            },
            someTestFunction2: function() {

            }
        });
        var ChildClass = Class.extend(ParentClass, {
            someTestFunction1: function() {

            },
            someTestFunction3: function() {

            }
        });
        var instanceChildClass = new ChildClass();


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertTrue(TypeUtil.isFunction(ChildClass.prototype.someTestFunction1),
            "Assert override function added to child class is function and is present in child class prototype");
        this.assertTrue(TypeUtil.isFunction(ChildClass.prototype.someTestFunction2),
            "Assert function of parent class is function and is present in child class prototype");
        this.assertTrue(TypeUtil.isFunction(ChildClass.prototype.someTestFunction2),
            "Assert function added to child class is function and is present in child class prototype");
        this.assertTrue(TypeUtil.isFunction(instanceChildClass.someTestFunction1),
            "Assert override function added to child class is present in child class instance");
        this.assertTrue(TypeUtil.isFunction(instanceChildClass.someTestFunction2),
            "Assert function of parent class is present in child class instance");
        this.assertTrue(TypeUtil.isFunction(instanceChildClass.someTestFunction3),
            "Assert function added to child class is present in child class instance");

        this.assertTrue(Class.doesExtend(instanceChildClass, Obj),
            "Assert child class extends base level Object class");
        this.assertTrue(Class.doesExtend(instanceChildClass, Obj),
            "Assert child class extends parent class");

    }).with('@Test("Class extend test")'),

    /**
     *
     */
    classImplementTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var TestInterface = Interface.declare({
            someInterfaceFunction: function() {

            }
        });
        var TestClass = Class.extend(Obj, {
            someInterfaceFunction: function() {

            },
            someFunction: function() {

            }
        });
        Class.implement(TestClass, TestInterface);
        var instance = new TestClass();


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertTrue(TypeUtil.isFunction(TestClass.prototype.someFunction),
            "Assert function added to class is function and is present in class prototype");
        this.assertTrue(TypeUtil.isFunction(TestClass.prototype.someInterfaceFunction),
            "Assert interface function added to class is function and is present in class prototype");
        this.assertEqual(TestClass.getInterfaces().length, 2,
            "Assert we have 2 interfaces listed on TestClass (IHashCode and TestInterface)");
        this.assertEqual(TestClass.getInterfaces()[1], TestInterface,
            "Assert test interface is listed in TestClass interfaces");
        this.assertTrue(TypeUtil.isFunction(instance.someFunction),
            "Assert function added to class is present in class instance");
        this.assertTrue(TypeUtil.isFunction(instance.someInterfaceFunction),
            "Assert interface function added to class is present in class instance");
        this.assertEqual(instance.getClass().getInterfaces().length, 2,
            "Assert we have 2 interfaces listed in instance of TestClass through getClass()");
        this.assertEqual(instance.getClass().getInterfaces()[1], TestInterface,
            "Assert TestInterface is listed in interfaces on instance of TestClass through getClass()");
        this.assertTrue(Class.doesImplement(instance, TestInterface),
            "Assert Class.doesImplement returns true for instance implementing TestInterface");

    }).with('@Test("Class implement test")'),

    /**
     *
     */
    classDoesImplementTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var TestInterface = Interface.declare({
            someInterfaceFunction: function() {

            }
        });
        var TestClass = Class.extend(Obj, {
            someInterfaceFunction: function() {

            },
            someFunction: function() {

            }
        });
        Class.implement(TestClass, TestInterface);
        var instance = new TestClass();
        var valuesThatDoNotImplement = [
            {},
            [],
            function() {},
            "some string",
            12345
        ];


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertEqual(Class.doesImplement(instance, TestInterface), true,
            "Assert that and instance of our test class does implement the test interface");
        var _this = this;
        valuesThatDoNotImplement.forEach(function(value) {
            _this.assertEqual(Class.doesImplement(value, TestInterface), false,
                "Assert that the value '" + value + "' does not implement the test interface");
        });
    }).with('@Test("Class doesImplement test")'),

    /**
     *
     */
    classConstructorTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var constructorCalled = false;
        var _test = this;
        var TestClass = Class.extend(Obj, {
            _constructor: function() {
                constructorCalled = true;
                _test.assertEqual(this.getClass(), TestClass,
                    "Assert that the class is available during construction");
            }
        });


        // Run Test
        //-------------------------------------------------------------------------------

        var instance = new TestClass();
        this.assertEqual(constructorCalled, true,
            "Assert that the constructor was called during instantiation");

    }).with('@Test("Class constructor test")')
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = ClassTests;
