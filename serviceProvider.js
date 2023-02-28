const ServiceType = {
    Singleton: {},
    Scoped: {},
    Transient: {}
}


class ServiceCollection {
    constructor() {
        this._map = {};
        this._singletons = {};
        this._scopeds = {};
        this._transients = {};
    }

    getImplemented(serviceType) {
        switch (serviceType) {
            case ServiceType.Singleton: return this._singletons;
            case ServiceType.Scoped: return this._scopeds;
            case ServiceType.Transient: return this._transients;
            default: throw new Error("invalid serviceType");
        }
    }


    addSingletonClass(name, aClass) {
        if (this._map[name]) throw new Error(`${name} already exists!`);
        if (typeof (aClass) !== "function") throw new Error(`not class!`);

        this._singletons[name] = aClass;
        this._map[name] = ServiceType.Singleton;

        return this;
    }


    addScopedClass(name, aClass) {
        if (this._map[name]) throw new Error(`${name} already exists!`);
        if (typeof (aClass) !== "function") throw new Error(`not class!`);

        this._scopeds[name] = aClass;
        this._map[name] = ServiceType.Scoped;

        return this;
    }

    addTransientClass(name, aClass) {
        if (this._map[name]) throw new Error(`${name} already exists!`);
        if (typeof (aClass) !== "function") throw new Error(`not class!`);

        this._transients[name] = aClass;
        this._map[name] = ServiceType.Transient;

        return this;
    }

    getType(serviceName) {
        return this._map[serviceName];
    }
}







class ServiceProvider {
    constructor(aServiceCollection, serviceType, srcPool) {
        this._serviceCollection = aServiceCollection;
        this._serviceType = serviceType;
        const pool = Object.assign({}, srcPool);
        const implementeds = this._serviceCollection.getImplemented(serviceType);
        this._implementeds = {};

        this._pool = Object.keys(implementeds).reduce((a, serviceName) => {
            a[serviceName] = () => {
                if (this._implementeds[serviceName]) return this._implementeds[serviceName];
                this._implementeds[serviceName] = new implementeds[serviceName](this._pool);
                return this._implementeds[serviceName];
            };
            return a;
        }, pool);
    }


    getService(name) {
        return this._pool[name]();
    }

    useSingleton(name) {
        if (this._serviceCollection.getType(name) !== ServiceType.Singleton) throw new Error("not singleton!");
        return this._pool[name]();
    }

    useScope(name) {
        if (this._serviceCollection.getType(name) !== ServiceType.Scoped) throw new Error("not scoped!");

        const result = new ServiceProvider(this._serviceCollection, ServiceType.Scoped, this._pool);
        return result.getService(name);
    }

    createScope() {
        if (this._serviceType !== ServiceType.Singleton) throw new Error("scoped only base on singleton!");
        const result = new ServiceProvider(this._serviceCollection, ServiceType.Scoped, this._pool);
        return result;
    }

    createTransient(name) {
        if (this._serviceCollection.getType(name) !== ServiceType.Transient) throw new Error("not transient!");
        if (this._serviceType !== ServiceType.Scoped) throw new Error("transient only creates on scoped!");

        const pool = Object.assign({}, this._pool);
        const implementeds = this._serviceCollection.getImplemented(ServiceType.Transient);

        Object.keys(implementeds).reduce((a, serviceName) => {
            a[serviceName] = () => new implementeds[serviceName](pool);
            return a;
        }, pool);
        return pool[name]();
    }

    static build(collection) {
        return new ServiceProvider(collection, ServiceType.Singleton, {});
    }
}

module.exports = {
    ServiceType,
    ServiceCollection,
    ServiceProvider
};