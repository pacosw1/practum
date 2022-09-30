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
const _groupsDto = require("../dtos/groups.dto");
const _groupsController = _interopRequireDefault(require("../controllers/groups.controller"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let GroupsRoute = class GroupsRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, this.controller.getAll);
        this.router.get(`${this.path}/:id(\\d+)`, this.controller.getGivenId);
        this.router.post(`${this.path}`, (0, _validationMiddleware.default)(_groupsDto.CreateGroupDto, 'body'), this.controller.create);
        this.router.put(`${this.path}/:id(\\d+)`, (0, _validationMiddleware.default)(_groupsDto.CreateGroupDto, 'body', true), this.controller.update);
        this.router.delete(`${this.path}/:id(\\d+)`, this.controller.delete);
    }
    constructor(){
        this.path = '/groups';
        this.router = (0, _express.Router)();
        this.controller = new _groupsController.default();
        this.initializeRoutes();
    }
};
const _default = GroupsRoute;

//# sourceMappingURL=groups.route.js.map