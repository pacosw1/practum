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
let AreaService = class AreaService {
    async getAllAreas() {
        const allAreas = await this.areas.findMany({
            orderBy: {
                id: 'asc'
            }
        });
        return allAreas;
    }
    async getAreaGivenId(id) {
        if ((0, _util.isEmpty)(id)) throw new _httpException.HttpException(400, 'id is empty');
        const findArea = await this.areas.findUnique({
            where: {
                id: id
            }
        });
        if (!findArea) throw new _httpException.HttpException(409, "Area doesn't exist");
        return findArea;
    }
    async createArea(areaData) {
        if ((0, _util.isEmpty)(areaData)) throw new _httpException.HttpException(400, 'userData is empty');
        const findArea = await this.areas.findUnique({
            where: {
                name: areaData.name
            }
        });
        if (findArea) throw new _httpException.HttpException(409, `Area with title ${areaData.name} already exists`);
        const createAreaData = await this.areas.create({
            data: _objectSpread({}, areaData)
        });
        return createAreaData;
    }
    async updateArea(id, data) {
        if ((0, _util.isEmpty)(data)) throw new _httpException.HttpException(400, 'userData is empty');
        const findArea = await this.areas.findUnique({
            where: {
                id: id
            }
        });
        if (!findArea) throw new _httpException.HttpException(409, "User doesn't exist");
        const newArea = await this.areas.update({
            where: {
                id: id
            },
            data: _objectSpread({}, data)
        });
        return newArea;
    }
    async deleteArea(id) {
        if ((0, _util.isEmpty)(id)) throw new _httpException.HttpException(400, "User doesn't existId");
        const findArea = await this.areas.findUnique({
            where: {
                id: id
            }
        });
        if (!findArea) throw new _httpException.HttpException(409, "User doesn't exist");
        const deleteAreaData = await this.areas.delete({
            where: {
                id: id
            }
        });
        return deleteAreaData;
    }
    constructor(){
        this.areas = new _client.PrismaClient().area;
    }
};
const _default = AreaService;

//# sourceMappingURL=area.service.js.map