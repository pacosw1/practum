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
let GroupService = class GroupService {
    async getAll() {
        const allGroups = await this.groups.findMany({
            where: {
                active: true
            },
            orderBy: {
                order: 'asc'
            }
        });
        return allGroups;
    }
    async getGivenId(id) {
        if ((0, _util.isEmpty)(id)) throw new _httpException.HttpException(400, 'id is empty');
        const findGroup = await this.groups.findUnique({
            where: {
                id: id
            }
        });
        if (!findGroup || findGroup && !findGroup.active) throw new _httpException.HttpException(409, "Group doesn't exist");
        return findGroup;
    }
    async create(data) {
        if ((0, _util.isEmpty)(data)) throw new _httpException.HttpException(400, 'data is empty');
        const findGroup = await this.groups.findUnique({
            where: {
                name: data.name
            }
        });
        if (findGroup) throw new _httpException.HttpException(409, `Group with title ${data.name} already exists`);
        const count = await this.groups.count({
            where: {
                active: true
            }
        });
        const createdata = await this.groups.create({
            data: _objectSpreadProps(_objectSpread({}, data), {
                order: count + 1
            })
        });
        return createdata;
    }
    async update(id, data) {
        if ((0, _util.isEmpty)(data)) throw new _httpException.HttpException(400, 'data is empty');
        const findGroup = await this.groups.findUnique({
            where: {
                id: id
            }
        });
        if (!findGroup || findGroup && !findGroup.active) throw new _httpException.HttpException(409, "Group doesn't exist");
        const newGroup = await this.groups.update({
            where: {
                id: id
            },
            data: _objectSpread({}, data)
        });
        return newGroup;
    }
    async delete(id) {
        if ((0, _util.isEmpty)(id)) throw new _httpException.HttpException(400, "Group doesn't existId");
        const findGroup = await this.groups.findUnique({
            where: {
                id: id
            }
        });
        if (!findGroup) throw new _httpException.HttpException(409, "Group doesn't exist");
        const deleteGroup = await this.groups.update({
            where: {
                id: id
            },
            data: _objectSpreadProps(_objectSpread({}, findGroup), {
                active: false
            })
        });
        return deleteGroup;
    }
    constructor(){
        this.groups = new _client.PrismaClient().group;
    }
};
const _default = GroupService;

//# sourceMappingURL=groups.service.js.map