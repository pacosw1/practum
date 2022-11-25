"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _client = require("@prisma/client");
const _httpException = require("../exceptions/HttpException");
const _util = require("../utils/util");
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
let EntryService = class EntryService {
    async getAll() {
        const all = await this.entries.findMany({
            orderBy: {
                id: 'asc'
            },
            where: {
                active: true
            }
        });
        return all;
    }
    async create(data) {
        if ((0, _util.isEmpty)(data)) throw new _httpException.HttpException(400, 'userData is empty');
        const findEntry = await this.entries.findUnique({
            where: {
                name: data.name
            }
        });
        if (findEntry) throw new _httpException.HttpException(409, `Process with title ${data.name} already exists`);
        const createEntry = await this.entries.create({
            data: _objectSpread({}, data)
        });
        return createEntry;
    }
    async update(id, data) {
        if ((0, _util.isEmpty)(data)) throw new _httpException.HttpException(400, 'userData is empty');
        const findEntry = await this.entries.findUnique({
            where: {
                id: id
            }
        });
        if (!findEntry || findEntry && !findEntry.active) throw new _httpException.HttpException(409, "Entry doesn't exist");
        const newEntry = await this.entries.update({
            where: {
                id: id
            },
            data: _objectSpread({}, data)
        });
        return newEntry;
    }
    async delete(id) {
        if ((0, _util.isEmpty)(id)) throw new _httpException.HttpException(400, "User doesn't existId");
        const findEntry = await this.entries.findUnique({
            where: {
                id: id
            }
        });
        if (!findEntry) throw new _httpException.HttpException(409, "User doesn't exist");
        const deleted = await new _client.PrismaClient().entriesOnProcess.deleteMany({
            where: {
                entryId: id
            }
        });
        console.log(deleted);
        const deleteEntry = await this.entries.update({
            where: {
                id: id
            },
            data: _objectSpreadProps(_objectSpread({}, findEntry), {
                active: false
            })
        });
        return deleteEntry;
    }
    constructor(){
        this.entries = new _client.PrismaClient().entry;
    }
};
const _default = EntryService;

//# sourceMappingURL=entry.service.js.map