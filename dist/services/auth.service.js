"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _bcrypt = require("bcrypt");
const _jsonwebtoken = require("jsonwebtoken");
const _client = require("@prisma/client");
const _config = require("../config");
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
let AuthService = class AuthService {
    async signup(userData) {
        if ((0, _util.isEmpty)(userData)) throw new _httpException.HttpException(400, 'userData is empty');
        const findUser = await this.users.findUnique({
            where: {
                email: userData.email
            }
        });
        if (findUser) throw new _httpException.HttpException(409, `This email ${userData.email} already exists`);
        const hashedPassword = await (0, _bcrypt.hash)(userData.password, 10);
        const createUserData = this.users.create({
            data: _objectSpreadProps(_objectSpread({}, userData), {
                password: hashedPassword
            })
        });
        return createUserData;
    }
    async access(token) {
        try {
            const secretKey = _config.SECRET_KEY;
            const verificationResponse = await (0, _jsonwebtoken.verify)(token, secretKey);
            const userId = verificationResponse.id;
            const users = new _client.PrismaClient().user;
            const findUser = await users.findUnique({
                where: {
                    id: Number(userId)
                }
            });
            if (findUser) {
                return {
                    authenticated: true,
                    data: {
                        email: findUser.email,
                        id: findUser.id
                    }
                };
            } else {
                return {
                    authenticated: false,
                    data: null
                };
            }
        } catch (err) {
            return {
                authenticated: false,
                data: null
            };
        }
    }
    async login(userData) {
        if ((0, _util.isEmpty)(userData)) throw new _httpException.HttpException(400, 'userData is empty');
        const findUser = await this.users.findUnique({
            where: {
                email: userData.email
            }
        });
        if (!findUser) throw new _httpException.HttpException(409, `This email ${userData.email} was not found`);
        const isPasswordMatching = await (0, _bcrypt.compare)(userData.password, findUser.password);
        if (!isPasswordMatching) throw new _httpException.HttpException(409, 'Password is not matching');
        const tokenData = this.createToken(findUser);
        return {
            tokenData,
            findUser
        };
    }
    async logout(userData) {
        if ((0, _util.isEmpty)(userData)) throw new _httpException.HttpException(400, 'userData is empty');
        const findUser = await this.users.findFirst({
            where: {
                email: userData.email,
                password: userData.password
            }
        });
        if (!findUser) throw new _httpException.HttpException(409, "User doesn't exist");
        return findUser;
    }
    createToken(user) {
        const dataStoredInToken = {
            id: user.id
        };
        const secretKey = _config.SECRET_KEY;
        const expiresIn = 1000 * 60 * 60 * 24 * 30;
        return {
            expiresIn,
            token: (0, _jsonwebtoken.sign)(dataStoredInToken, secretKey, {
                expiresIn
            })
        };
    }
    constructor(){
        this.users = new _client.PrismaClient().user;
    }
};
const _default = AuthService;

//# sourceMappingURL=auth.service.js.map