const assert = require("assert");
const {
    ServiceType,
    ServiceCollection,
    ServiceProvider
} = require("../serviceProvider");

describe("ServiceCollection create", () => {
    describe("addSingletonClass", () => {
        it("should add a singleton class to the collection", () => {
            const collection = new ServiceCollection();
            collection.addSingletonClass("TestClass", class TestClass { });

            const result = collection.getType("TestClass");

            assert.equal(result, ServiceType.Singleton);
        });

        it("should throw an error if the class name already exists in the collection", () => {
            const collection = new ServiceCollection();
            collection.addSingletonClass("TestClass", class TestClass { });

            assert.throws(() => {
                collection.addSingletonClass("TestClass", class TestClass { });
            }, /already exists/);
        });

        it("should throw an error if the second parameter is not a class", () => {
            const collection = new ServiceCollection();

            assert.throws(() => {
                collection.addSingletonClass("TestClass", {});
            }, /not class/);
        });
    });


    describe("addSingletonObject", () => {

        let aObj;


        beforeEach(function () {
            aObj = {
                a: 3,
                b: 4,
                getSum: function () {
                    return this.a + this.b;
                }
            };
        });

        it("add a object should be Singleton to the collection", () => {
            const collection = new ServiceCollection();
            collection.addSingletonObject("Obj", aObj);

            const result = collection.getType("Obj");

            assert.equal(result, ServiceType.Singleton);
        });

        it("should throw an error if object name already exists in the collection", () => {
            const collection = new ServiceCollection();
            collection.addSingletonObject("Obj", aObj);

            assert.throws(() => {
                collection.addSingletonObject("Obj", aObj);
            }, /already exists/);
        });

        it("should throw an error if the second parameter is not a object", () => {
            const collection = new ServiceCollection();

            assert.throws(() => {
                collection.addSingletonObject("Obj", class TestClass { });
            }, /not object/);
        });
    });



    describe("addScopedClass", () => {
        it("should add a scoped class to the collection", () => {
            const collection = new ServiceCollection();
            collection.addScopedClass("TestClass", class TestClass { });

            const result = collection.getType("TestClass");

            assert.equal(result, ServiceType.Scoped);
        });

        it("should throw an error if the class name already exists in the collection", () => {
            const collection = new ServiceCollection();
            collection.addScopedClass("TestClass", class TestClass { });

            assert.throws(() => {
                collection.addScopedClass("TestClass", class TestClass { });
            }, /already exists/);
        });

        it("should throw an error if the second parameter is not a class", () => {
            const collection = new ServiceCollection();

            assert.throws(() => {
                collection.addScopedClass("TestClass", {});
            }, /not class/);
        });
    });

    describe("addTransientClass", () => {
        it("should add a transient class to the collection", () => {
            const collection = new ServiceCollection();
            collection.addTransientClass("TestClass", class TestClass { });

            const result = collection.getType("TestClass");

            assert.equal(result, ServiceType.Transient);
        });

        it("should throw an error if the class name already exists in the collection", () => {
            const collection = new ServiceCollection();
            collection.addTransientClass("TestClass", class TestClass { });

            assert.throws(() => {
                collection.addTransientClass("TestClass", class TestClass { });
            }, /already exists/);
        });

        it("should throw an error if the second parameter is not a class", () => {
            const collection = new ServiceCollection();

            assert.throws(() => {
                collection.addTransientClass("TestClass", {});
            }, /not class/);
        });
    });
});





describe("ServiceProvider create", () => {
    describe("getService", () => {
        it("should return an instance of the requested service", () => {
            const collection = new ServiceCollection();
            collection.addSingletonClass("TestClass", class TestClass { });

            const serviceProvider = ServiceProvider.build(collection);
            const result = serviceProvider.getService("TestClass");

            assert(result instanceof collection._singletons.TestClass);
        });
    });

    describe("useSingleton", () => {
        it("should return the same instance of a singleton service", () => {
            const collection = new ServiceCollection();
            collection.addSingletonClass("TestClass", class TestClass { });

            const serviceProvider = ServiceProvider.build(collection);
            const result1 = serviceProvider.useSingleton("TestClass");
            const result2 = serviceProvider.useSingleton("TestClass");

            assert.strictEqual(result1, result2);
        });

        it("should throw an error if the requested service is not a singleton", () => {
            const collection = new ServiceCollection();
            collection.addScopedClass("TestClass", class TestClass { });

            const serviceProvider = ServiceProvider.build(collection);

            assert.throws(() => {
                serviceProvider.useSingleton("TestClass");
            }, /not singleton/);
        });
    });

    describe("useScope", () => {
        it("should return an instance of a scoped service", () => {
            const collection = new ServiceCollection();
            collection.addScopedClass("TestClass", class TestClass { });

            const serviceProvider = ServiceProvider.build(collection);
            const result = serviceProvider.useScope("TestClass");

            assert(result instanceof collection._scopeds.TestClass);
        });

        it("should throw an error if the requested service is not a scoped service", () => {
            const collection = new ServiceCollection();
            collection.addSingletonClass("TestClass", class TestClass { });

            const serviceProvider = ServiceProvider.build(collection);

            assert.throws(() => {
                serviceProvider.useScope("TestClass");
            }, /not scoped/);
        });
    });

    describe("createScope", () => {
        it("should return a new ServiceProvider with the scoped service type", () => {
            const collection = new ServiceCollection();
            collection.addSingletonClass("TestClass", class TestClass { });

            const serviceProvider = ServiceProvider.build(collection);
            const scope = serviceProvider.createScope();

            assert.equal(scope._serviceType, ServiceType.Scoped);
        });

        it("should throw an error if the ServiceProvider is not a singleton service", () => {
            const collection = new ServiceCollection();
            collection.addSingletonClass("TestClass", class TestClass { });

            const serviceProvider = ServiceProvider.build(collection);
            const newServiceProvider = serviceProvider.createScope();

            assert.throws(() => {
                newServiceProvider.createScope();
            }, /scoped only base on singleton/);
        });
    });

    describe("createTransient", () => {
        it("should return a new instance of a transient service", () => {
            const collection = new ServiceCollection();
            collection.addSingletonClass("TestSingleton", class TestSingleton { });
            collection.addScopedClass("TestScoped", class TestScoped { });
            collection.addTransientClass("TestTransient", class TestTransient { });

            const singletonProvider = ServiceProvider.build(collection);
            const scopeProvider = singletonProvider.createScope();
            const result = scopeProvider.createTransient("TestTransient");

            assert(result instanceof collection._transients.TestTransient);
        });

        it("should throw an error if the requested service is not a transient service", () => {
            const collection = new ServiceCollection();
            collection.addScopedClass("TestClass", class TestClass { });

            const serviceProvider = ServiceProvider.build(collection);

            assert.throws(() => {
                serviceProvider.createTransient("TestClass");
            }, /not transient/);
        });

        it("should throw an error if the ServiceProvider is not a scoped service", () => {
            const collection = new ServiceCollection();
            collection.addTransientClass("TestClass", class TestClass { });

            const serviceProvider = ServiceProvider.build(collection);

            assert.throws(() => {
                serviceProvider.createTransient("TestClass");
            }, /transient only creates on scoped/);
        });
    });
});



describe("ServiceProvider use", () => {


    const aObj = {
        a: 3,
        b: 4,
        getSum: function () {
            return this.a + this.b;
        }
    };

    class Singleton1 {
        constructor({ Singleton2 }) {
            console.log("Singleton1 created...");
            this._singleton2 = () => Singleton2();
        }

        get val() {
            return 3;
        }

        getVal() {
            return this.val + 2 * this._singleton2().val; //17
        }
    }

    class Singleton2 {
        constructor({ Singleton1 }) {
            console.log("Singleton2 created...");
            this._singleton1 = () => Singleton1();
        }

        get val() {
            return 7;
        }

        getVal() {
            return this.val + 2 * this._singleton1().val; //13
        }
    }


    class Singleton3 {
        constructor() {
            console.log("Singleton3 created...");
        }

        get val() {
            return 2;
        }

        getVal() {
            return this.val; //2
        }
    }


    class Scoped1 {
        constructor({ Singleton2, Scoped2 }) {
            console.log("Scoped1 created...");
            this._singleton2 = () => Singleton2();
            this._scoped2 = () => Scoped2();
        }

        get val() {
            return 113;
        }

        getVal() {
            return this.val + 2 * this._singleton2().val + 5 * this._scoped2().val; //712
        }
    }

    class Scoped2 {
        constructor({ Singleton1, Scoped1 }) {
            console.log("Scoped2 created...");
            this._singleton1 = () => Singleton1();
            this._scoped1 = () => Scoped1();
        }

        get val() {
            return 117;
        }

        getVal() {
            return this.val + 2 * this._singleton1().getVal() + 5 * this._scoped1().getVal(); //3711
        }
    }


    class Scoped3 {
        constructor() {
            console.log("Singleton3 created...");
        }

        get val() {
            return 123;
        }

        getVal() {
            return this.val; //123
        }
    }



    class Transient1 {
        constructor({ Singleton2, Scoped2, Transient2 }) {
            console.log("Transient1 created...");
            this._singleton2 = () => Singleton2();
            this._scoped2 = () => Scoped2();
            this._transient2 = () => Transient2();
        }

        get val() {
            return 213;
        }

        getVal() {
            return this.val + 2 * this._singleton2().val + 5 * this._scoped2().val + 7 * this._transient2().val; //2331
        }
    }

    class Transient2 {
        constructor({ Singleton1, Scoped1, Transient1 }) {
            console.log("Transient2 created...");
            this._singleton1 = () => Singleton1();
            this._scoped1 = () => Scoped1();
            this._transient1 = () => Transient1();
        }

        get val() {
            return 217;
        }

        getVal() {
            return this.val + 2 * this._singleton1().getVal() + 5 * this._scoped1().getVal() + 7 * this._transient1().getVal(); //20128
        }
    }


    class Transient3 {
        constructor() {
            console.log("Transient3 created...");
        }

        get val() {
            return 223;
        }

        getVal() {
            return this.val; //223
        }
    }





    describe("use singleton", () => {
        let aServiceProvider;

        beforeEach(function () {
            const aServiceCollection = new ServiceCollection();
            aServiceCollection
                .addSingletonClass("Singleton1", Singleton1)
                .addSingletonClass("Singleton2", Singleton2)
                .addSingletonClass("Singleton3", Singleton3)
                .addSingletonObject("Obj", aObj);

            aServiceProvider = ServiceProvider.build(aServiceCollection);
        });

        it("Singleton object should be same", function () {
            const newObj = aServiceProvider.useSingleton("Obj");

            assert.strictEqual(aObj, newObj);
        });

        it("Singleton1 should be created once", function () {
            const s1 = aServiceProvider.useSingleton("Singleton1");
            const s2 = aServiceProvider.useSingleton("Singleton1");

            assert.strictEqual(s1, s2);
        });

        it("Singleton1.getVal()", function () {
            const val = aServiceProvider.useSingleton("Singleton1").getVal();
            assert.strictEqual(val, 17);
        });

        it("Singleton2.getVal()", function () {
            const val = aServiceProvider.useSingleton("Singleton2").getVal();
            assert.strictEqual(val, 13);
        });

        it("Singleton3.getVal()", function () {
            const val = aServiceProvider.useSingleton("Singleton3").getVal();
            assert.strictEqual(val, 2);
        });
    });


    describe("use scoped", () => {
        let aServiceProvider;

        beforeEach(function () {
            const aServiceCollection = new ServiceCollection();
            aServiceCollection
                .addSingletonClass("Singleton1", Singleton1)
                .addSingletonClass("Singleton2", Singleton2)
                .addSingletonClass("Singleton3", Singleton3)
                .addScopedClass("Scoped1", Scoped1)
                .addScopedClass("Scoped2", Scoped2)
                .addScopedClass("Scoped3", Scoped3);

            aServiceProvider = ServiceProvider.build(aServiceCollection);
        });

        it("Scoped1 should be created once", function () {
            const scope = aServiceProvider.createScope();
            const s1 = scope.getService("Scoped1");
            const s2 = scope.getService("Scoped1");
            assert.strictEqual(s1, s2);
        });


        it("different scope should be different", function () {
            const scope1 = aServiceProvider.createScope();
            const scope2 = aServiceProvider.createScope();
            const s1 = scope1.getService("Scoped1");
            const s2 = scope2.getService("Scoped1");
            assert.notStrictEqual(s1, s2);
        });


        it('Scoped1.getVal()', function () {
            const scope = aServiceProvider.createScope();
            const val = scope.getService("Scoped1").getVal();
            assert.strictEqual(val, 712);
        });

        it('Scoped2.getVal()', function () {
            const scope = aServiceProvider.createScope();
            const val = scope.getService("Scoped2").getVal();
            assert.strictEqual(val, 3711);
        });

        it('Scoped3.getVal()', function () {
            const scope = aServiceProvider.createScope();
            const val = scope.getService("Scoped3").getVal();
            assert.strictEqual(val, 123);
        });
    });


    describe("use transient3", () => {
        let scope;

        beforeEach(function () {
            const aServiceCollection = new ServiceCollection();
            aServiceCollection
                .addSingletonClass("Singleton1", Singleton1)
                .addSingletonClass("Singleton2", Singleton2)
                .addSingletonClass("Singleton3", Singleton3)
                .addScopedClass("Scoped1", Scoped1)
                .addScopedClass("Scoped2", Scoped2)
                .addScopedClass("Scoped3", Scoped3)
                .addTransientClass("Transient1", Transient1)
                .addTransientClass("Transient2", Transient2)
                .addTransientClass("Transient3", Transient3);

            scope = ServiceProvider.build(aServiceCollection)
                .createScope();
        });

        it("Transient1 should be created everytime", function () {
            const t1 = scope.createTransient("Transient1");
            const t2 = scope.createTransient("Transient1");
            assert.notStrictEqual(t1, t2);
        });

        it('Transient1.getVal()', function () {
            const val = scope.createTransient("Transient1").getVal();
            assert.strictEqual(val, 2331);
        });

        it('Transient2.getVal()', function () {
            const val = scope.createTransient("Transient2").getVal();
            assert.strictEqual(val, 20128);
        });

        it('Transient3.getVal()', function () {
            const val = scope.createTransient("Transient3").getVal();
            assert.strictEqual(val, 223);
        });
    });

});


