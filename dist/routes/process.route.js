"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _express = require("express");
const _validationMiddleware = _interopRequireDefault(require("../middlewares/validation.middleware"));
const _processController = _interopRequireDefault(require("../controllers/process.controller"));
const _processDto = require("../dtos/process.dto");
const _authMiddleware = _interopRequireDefault(require("../middlewares/auth.middleware"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let ProcessRoute = class ProcessRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, this.controller.getAll);
        this.router.get(`${this.path}/:id(\\d+)`, this.controller.getGivenId);
        this.router.get(`${this.path}/filter/:areaId&:groupId`, this.controller.getGivenAreaAndGroup);
        this.router.post(`${this.path}`, _authMiddleware.default, (0, _validationMiddleware.default)(_processDto.CreateProcessDto, 'body'), this.controller.create);
        this.router.put(`${this.path}/:id(\\d+)`, _authMiddleware.default, (0, _validationMiddleware.default)(_processDto.CreateProcessDto, 'body', true), this.controller.update);
        this.router.delete(`${this.path}/:id(\\d+)`, _authMiddleware.default, this.controller.delete);
    }
    constructor(){
        this.path = '/process';
        this.router = (0, _express.Router)();
        this.controller = new _processController.default();
        this.initializeRoutes();
    }
};
const _default = ProcessRoute;

//# sourceMappingURL=process.route.js.map