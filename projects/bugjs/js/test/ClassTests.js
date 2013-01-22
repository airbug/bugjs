//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('IHashCode')
//@Require('Interface')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('annotate.Annotate')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var IHashCode =         bugpack.require('IHashCode');
var Interface =         bugpack.require('Interface');
var Obj =               bugpack.require('Obj');
var TypeUtil =          bugpack.require('TypeUtil');
var Annotate =          bugpack.require('annotate.Annotate');
var TestAnnotation =    bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var test = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 *
 */
var classExtendObjTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.NewClass = Class.extend(Obj, {
            someTestFunction1: function() {
    
            },
            someTestFunction2: function() {
    
            }
        });
        this.instance = new this.NewClass();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(TypeUtil.isFunction(this.NewClass.prototype.someTestFunction1),
            "Assert function added to class is function and is present in class prototype");
        test.assertTrue(TypeUtil.isFunction(this.NewClass.prototype.someTestFunction2),
            "Assert second function added to class is function and is present in class prototype");
        test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction1),
            "Assert function added to class is present in class instance");
        test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction2),
            "Assert second function added to class is present in class instance");
        test.assertTrue(Class.doesExtend(this.instance, Obj),
            "Assert instance of new class extends base level Object class");
        test.assertTrue(Class.doesImplement(this.instance, IHashCode),
            "Assert instance of new class implements IHashCode");
    }
};
annotate(classExtendObjTest).with(
    test().name("Class extend Obj test")
);


/**
 *
 */
var classExtendTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.ParentClass = Class.extend(Obj, {
            someTestFunction1: function() {
    
            },
            someTestFunction2: function() {
    
            }
        });
        this.ChildClass = Class.extend(this.ParentClass, {
            someTestFunction1: function() {
    
            },
            someTestFunction3: function() {
    
            }
        });
        this.instanceChildClass = new this.ChildClass();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(TypeUtil.isFunction(this.ChildClass.prototype.someTestFunction1),
            "Assert override function added to child class is function and is present in child class prototype");
        test.assertTrue(TypeUtil.isFunction(this.ChildClass.prototype.someTestFunction2),
            "Assert function of parent class is function and is present in child class prototype");
        test.assertTrue(TypeUtil.isFunction(this.ChildClass.prototype.someTestFunction2),
            "Assert function added to child class is function and is present in child class prototype");
        test.assertTrue(TypeUtil.isFunction(this.instanceChildClass.someTestFunction1),
            "Assert override function added to child class is present in child class instance");
        test.assertTrue(TypeUtil.isFunction(this.instanceChildClass.someTestFunction2),
            "Assert function of parent class is present in child class instance");
        test.assertTrue(TypeUtil.isFunction(this.instanceChildClass.someTestFunction3),
            "Assert function added to child class is present in child class instance");
    
        test.assertTrue(Class.doesExtend(this.instanceChildClass, Obj),
            "Assert child class extends base level Object class");
        test.assertTrue(Class.doesExtend(this.instanceChildClass, Obj),
            "Assert child class extends parent class");
    }
};
annotate(classExtendTest).with(
    test().name("Class extend test")
);


/**
 *
 */
var classImplementTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.TestInterface = Interface.declare({
            someInterfaceFunction: function() {
    
            }
        });
        this.TestClass = Class.extend(Obj, {
            someInterfaceFunction: function() {
    
            },
            someFunction: function() {
    
            }
        });
        Class.implement(this.TestClass, this.TestInterface);
        this.instance = new this.TestClass();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(TypeUtil.isFunction(this.TestClass.prototype.someFunction),
            "Assert function added to class is function and is present in class prototype");
        test.assertTrue(TypeUtil.isFunction(this.TestClass.prototype.someInterfaceFunction),
            "Assert interface function added to class is function and is present in class prototype");
        test.assertEqual(this.TestClass.getInterfaces().length, 3,
            "Assert we have 3 interfaces listed on TestClass (IHashCode, IEquals, and TestInterface)");
        test.assertEqual(this.TestClass.getInterfaces()[2], this.TestInterface,
            "Assert test interface is listed in TestClass interfaces");
        test.assertTrue(TypeUtil.isFunction(this.instance.someFunction),
            "Assert function added to class is present in class instance");
        test.assertTrue(TypeUtil.isFunction(this.instance.someInterfaceFunction),
            "Assert interface function added to class is present in class instance");
        test.assertEqual(this.instance.getClass().getInterfaces().length, 3,
            "Assert we have 2 interfaces listed in instance of TestClass through getClass()");
        test.assertEqual(this.instance.getClass().getInterfaces()[2], this.TestInterface,
            "Assert TestInterface is listed in interfaces on instance of TestClass through getClass()");
        test.assertTrue(Class.doesImplement(this.instance, this.TestInterface),
            "Assert Class.doesImplement returns true for instance implementing TestInterface");
    }
};
annotate(classImplementTest).with(
    test().name("Class implement test")
);


/**
 *
 */
var classDoesImplementTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.TestInterface = Interface.declare({
            someInterfaceFunction: function() {

            }
        });
        this.TestClass = Class.extend(Obj, {
            someInterfaceFunction: function() {

            },
            someFunction: function() {

            }
        });
        Class.implement(this.TestClass, this.TestInterface);
        this.instance = new this.TestClass();
        this.valuesThatDoNotImplement = [
            {},
            [],
            function() {},
            "some string",
            12345,
            null,
            undefined,
            0
        ];
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(Class.doesImplement(this.instance, this.TestInterface), true,
            "Assert that and instance of our test class does implement the test interface");
        var _this = this;
        this.valuesThatDoNotImplement.forEach(function(value) {
            test.assertEqual(Class.doesImplement(value, _this.TestInterface), false,
                "Assert that the value '" + value + "' does not implement the test interface");
        });
    }
};
annotate(classDoesImplementTest).with(
    test().name("Class doesImplement test")
);

/**
 *
 */
var classConstructorTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.constructorCalled = false;
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.TestClass = Class.extend(Obj, {
            _constructor: function() {
                _this.constructorCalled = true;
                test.assertEqual(this.getClass(), _this.TestClass,
                    "Assert that the class is available during construction");
            }
        });
        this.instance = new this.TestClass();
        test.assertEqual(this.constructorCalled, true,
            "Assert that the constructor was called during instantiation");
    }
};
annotate(classConstructorTest).with(
    test().name("Class constructor test")
);
