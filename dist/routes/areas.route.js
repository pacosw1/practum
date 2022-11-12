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
const _areasController = _interopRequireDefault(require("../controllers/areas.controller"));
const _areasDto = require("../dtos/areas.dto");
const _authMiddleware = _interopRequireDefault(require("../middlewares/auth.middleware"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let AreasRoute = class AreasRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, this.controller.getAreas);
        this.router.get(`${this.path}/:id(\\d+)`, this.controller.getAreaGivenId);
        this.router.post(`${this.path}`, _authMiddleware.default, (0, _validationMiddleware.default)(_areasDto.CreateAreaDto, 'body'), this.controller.createArea);
        this.router.put(`${this.path}/:id(\\d+)`, _authMiddleware.default, (0, _validationMiddleware.default)(_areasDto.CreateAreaDto, 'body', true), this.controller.updateArea);
        this.router.delete(`${this.path}/:id(\\d+)`, _authMiddleware.default, this.controller.deleteArea);
    }
    constructor(){
        this.path = '/areas';
        this.router = (0, _express.Router)();
        this.controller = new _areasController.default();
        this.initializeRoutes();
    }
};
const _default = AreasRoute;

//# sourceMappingURL=areas.route.js.map