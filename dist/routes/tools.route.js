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
const _processDto = require("../dtos/process.dto");
const _toolsController = _interopRequireDefault(require("../controllers/tools.controller"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let ToolsRoute = class ToolsRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, this.controller.getAll);
        this.router.post(`${this.path}`, (0, _validationMiddleware.default)(_processDto.CreateEntryExitDto, 'body'), this.controller.create);
        this.router.put(`${this.path}/:id(\\d+)`, (0, _validationMiddleware.default)(_processDto.CreateEntryExitDto, 'body', true), this.controller.update);
        this.router.delete(`${this.path}/:id(\\d+)`, this.controller.delete);
    }
    constructor(){
        this.path = '/tools';
        this.router = (0, _express.Router)();
        this.controller = new _toolsController.default();
        this.initializeRoutes();
    }
};
const _default = ToolsRoute;

//# sourceMappingURL=tools.route.js.map