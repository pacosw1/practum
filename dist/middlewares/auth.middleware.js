"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _jsonwebtoken = require("jsonwebtoken");
const _client = require("@prisma/client");
const _config = require("../config");
const _httpException = require("../exceptions/HttpException");
const authMiddleware = async (req, res, next)=>{
    try {
        const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
        if (Authorization) {
            const secretKey = _config.SECRET_KEY;
            const verificationResponse = await (0, _jsonwebtoken.verify)(Authorization, secretKey);
            const userId = verificationResponse.id;
            const users = new _client.PrismaClient().user;
            const findUser = await users.findUnique({
                where: {
                    id: Number(userId)
                }
            });
            if (findUser) {
                req.user = findUser;
                next();
            } else {
                next(new _httpException.HttpException(401, 'Wrong authentication token'));
            }
        } else {
            next(new _httpException.HttpException(404, 'Authentication token missing'));
        }
    } catch (error) {
        next(new _httpException.HttpException(401, 'Wrong authentication token'));
    }
};
const _default = authMiddleware;

//# sourceMappingURL=auth.middleware.js.map