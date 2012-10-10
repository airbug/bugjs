//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@export('IdGenerator')


//-------------------------------------------------------------------------------
// Constructor
//-------------------------------------------------------------------------------

// NOTE BRN: We don't use the base level Class system here because our low level Object class depends on this class
// and Class depends on Object. Thus, if this class depends on Class it creates s circular dependency.


var IdGenerator = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

IdGenerator.lastId = 0;

IdGenerator.generateId = function() {
    return IdGenerator.lastId++;
};

IdGenerator.injectId = function(obj) {
    if (obj !== null && obj !== undefined) {
        if (!obj._internalId) {
            Object.defineProperty(obj, "_internalId", {
                value : IdGenerator.generateId(),
                writable : false,
                enumerable : false,
                configurable : false
            });
        } else {
            throw new Error("Trying to inject an id in to a object that already has one.");
        }
    }
};

IdGenerator.ensureId = function(obj) {
    if (obj !== null && obj !== undefined) {
        if (!obj._internalId) {
            IdGenerator.injectId(obj);
        }
    }
};
