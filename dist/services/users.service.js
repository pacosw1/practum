"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _bcrypt = require("bcrypt");
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
let UserService = class UserService {
    async findAllUser() {
        const allUser = await this.users.findMany({
            orderBy: {
                id: 'asc'
            },
            where: {
                active: true
            }
        });
        return allUser;
    }
    async findUserById(userId) {
        if ((0, _util.isEmpty)(userId)) throw new _httpException.HttpException(400, 'UserId is empty');
        const findUser = await this.users.findUnique({
            where: {
                id: userId
            }
        });
        if (!findUser || findUser && !findUser.active) throw new _httpException.HttpException(409, "User doesn't exist");
        return findUser;
    }
    async createUser(userData) {
        if ((0, _util.isEmpty)(userData)) throw new _httpException.HttpException(400, 'userData is empty');
        const findUser = await this.users.findUnique({
            where: {
                email: userData.email
            }
        });
        if (findUser) throw new _httpException.HttpException(409, `This email ${userData.email} already exists`);
        const hashedPassword = await (0, _bcrypt.hash)(userData.password, 10);
        const createUserData = await this.users.create({
            data: _objectSpreadProps(_objectSpread({}, userData), {
                password: hashedPassword
            })
        });
        return createUserData;
    }
    async updateUser(userId, userData) {
        if ((0, _util.isEmpty)(userData)) throw new _httpException.HttpException(400, 'userData is empty');
        const findUser = await this.users.findUnique({
            where: {
                id: userId
            }
        });
        if (!findUser || findUser && !findUser.active) throw new _httpException.HttpException(409, "User doesn't exist");
        const hashedPassword = await (0, _bcrypt.hash)(userData.password, 10);
        const updateUserData = await this.users.update({
            where: {
                id: userId
            },
            data: _objectSpreadProps(_objectSpread({}, userData), {
                password: hashedPassword
            })
        });
        return updateUserData;
    }
    async deleteUser(userId) {
        if ((0, _util.isEmpty)(userId)) throw new _httpException.HttpException(400, "User doesn't existId");
        const findUser = await this.users.findUnique({
            where: {
                id: userId
            }
        });
        if (!findUser) throw new _httpException.HttpException(409, "User doesn't exist");
        const deleteUserData = await this.users.update({
            where: {
                id: userId
            },
            data: _objectSpreadProps(_objectSpread({}, findUser), {
                active: false
            })
        });
        return deleteUserData;
    }
    constructor(){
        this.users = new _client.PrismaClient().user;
    }
};
const _default = UserService;

//# sourceMappingURL=users.service.js.map