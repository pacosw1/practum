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
let GroupService = class GroupService {
    async getAll() {
        const allGroups = await this.groups.findMany();
        return allGroups;
    }
    async getGivenId(id) {
        if ((0, _util.isEmpty)(id)) throw new _httpException.HttpException(400, 'id is empty');
        const findGroup = await this.groups.findUnique({
            where: {
                id: id
            }
        });
        if (!findGroup) throw new _httpException.HttpException(409, "Group doesn't exist");
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
        const createdata = await this.groups.create({
            data: _objectSpread({}, data)
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
        if (!findGroup) throw new _httpException.HttpException(409, "Group doesn't exist");
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
        const deleteGroup = await this.groups.delete({
            where: {
                id: id
            }
        });
        return deleteGroup;
    }
    constructor(){
        this.groups = new _client.PrismaClient().group;
    }
};
const _default = GroupService;

//# sourceMappingURL=groups.service.js.map