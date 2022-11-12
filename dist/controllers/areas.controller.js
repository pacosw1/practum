"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _areaService = _interopRequireDefault(require("../services/area.service"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let AreasController = class AreasController {
    constructor(){
        this.service = new _areaService.default();
        this.getAreas = async (req, res, next)=>{
            try {
                const areas = await this.service.getAllAreas();
                res.status(200).json({
                    data: areas,
                    message: 'findAll'
                });
            } catch (error) {
                next(error);
            }
        };
        this.getAreaGivenId = async (req, res, next)=>{
            try {
                const id = Number(req.params.id);
                const findArea = await this.service.getAreaGivenId(id);
                res.status(200).json({
                    data: findArea,
                    message: 'findOne'
                });
            } catch (error) {
                next(error);
            }
        };
        this.createArea = async (req, res, next)=>{
            try {
                const data = req.body;
                const createAreaData = await this.service.createArea(data);
                res.status(201).json({
                    data: createAreaData,
                    message: 'created'
                });
            } catch (error) {
                next(error);
            }
        };
        this.updateArea = async (req, res, next)=>{
            try {
                const id = Number(req.params.id);
                const data = req.body;
                const updateUserData = await this.service.updateArea(id, data);
                res.status(200).json({
                    data: updateUserData,
                    message: 'updated'
                });
            } catch (error) {
                next(error);
            }
        };
        this.deleteArea = async (req, res, next)=>{
            try {
                const id = Number(req.params.id);
                const deleteUserData = await this.service.deleteArea(id);
                res.status(200).json({
                    data: deleteUserData,
                    message: 'deleted'
                });
            } catch (error) {
                next(error);
            }
        };
    }
};
const _default = AreasController;

//# sourceMappingURL=areas.controller.js.map