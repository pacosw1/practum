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
let ProcessService = class ProcessService {
    async getAll() {
        const all = await this.processes.findMany();
        return all;
    }
    async getGivenAreaAndGroup(areaId, groupId) {
        const filteredProcess = await this.processes.findMany({
            where: {
                areaId: areaId,
                groupId: groupId
            }
        });
        return filteredProcess;
    }
    async getGivenId(id) {
        if ((0, _util.isEmpty)(id)) throw new _httpException.HttpException(400, 'id is empty');
        const findProcess = await this.processes.findUnique({
            where: {
                id: id
            }
        });
        if (!findProcess) throw new _httpException.HttpException(409, "Area doesn't exist");
        return findProcess;
    }
    async create(data) {
        if ((0, _util.isEmpty)(data)) throw new _httpException.HttpException(400, 'userData is empty');
        data.areaId = Number(data.areaId);
        data.groupId = Number(data.groupId);
        const findProcess = await this.processes.findUnique({
            where: {
                name: data.name
            }
        });
        if (findProcess) throw new _httpException.HttpException(409, `Process with title ${data.name} already exists`);
        const createData = await this.processes.create({
            data: _objectSpread({}, data)
        });
        return createData;
    }
    async update(id, data) {
        if ((0, _util.isEmpty)(data)) throw new _httpException.HttpException(400, 'userData is empty');
        const findProcess = await this.processes.findUnique({
            where: {
                id: id
            }
        });
        if (!findProcess) throw new _httpException.HttpException(409, "User doesn't exist");
        const newProcess = await this.processes.update({
            where: {
                id: id
            },
            data: _objectSpread({}, data)
        });
        return newProcess;
    }
    async delete(id) {
        if ((0, _util.isEmpty)(id)) throw new _httpException.HttpException(400, "User doesn't existId");
        const findProcess = await this.processes.findUnique({
            where: {
                id: id
            }
        });
        if (!findProcess) throw new _httpException.HttpException(409, "User doesn't exist");
        const deleteProcess = await this.processes.delete({
            where: {
                id: id
            }
        });
        return deleteProcess;
    }
    constructor(){
        this.processes = new _client.PrismaClient().process;
    }
};
const _default = ProcessService;

//# sourceMappingURL=process.service.js.map