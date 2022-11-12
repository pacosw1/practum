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
const _authMiddleware = _interopRequireDefault(require("../middlewares/auth.middleware"));
const _entriesController = _interopRequireDefault(require("../controllers/entries.controller"));
const _processDto = require("../dtos/process.dto");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let EntriesRoute = class EntriesRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, this.controller.getAll);
        this.router.post(`${this.path}`, _authMiddleware.default, (0, _validationMiddleware.default)(_processDto.CreateEntryExitDto, 'body'), this.controller.create);
        this.router.put(`${this.path}/:id(\\d+)`, _authMiddleware.default, (0, _validationMiddleware.default)(_processDto.CreateEntryExitDto, 'body', true), this.controller.update);
        this.router.delete(`${this.path}/:id(\\d+)`, _authMiddleware.default, this.controller.delete);
    }
    constructor(){
        this.path = '/entries';
        this.router = (0, _express.Router)();
        this.controller = new _entriesController.default();
        this.initializeRoutes();
    }
};
const _default = EntriesRoute;

//# sourceMappingURL=entries.route.js.map