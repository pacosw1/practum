"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _processService = _interopRequireDefault(require("../services/process.service"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let ProcessController = class ProcessController {
    constructor(){
        this.service = new _processService.default();
        this.getAll = async (req, res, next)=>{
            try {
                const areas = await this.service.getAll();
                res.status(200).json({
                    data: areas,
                    message: 'findAll'
                });
            } catch (error) {
                next(error);
            }
        };
        this.getGivenAreaAndGroup = async (req, res, next)=>{
            try {
                const { groupId , areaId  } = req.params;
                const processes = await this.service.getGivenAreaAndGroup(Number(areaId), Number(groupId));
                res.status(200).json({
                    data: processes,
                    message: 'findFiltered'
                });
            } catch (error) {
                next(error);
            }
        };
        this.getGivenId = async (req, res, next)=>{
            try {
                const id = Number(req.params.id);
                const findArea = await this.service.getGivenId(id);
                res.status(200).json({
                    data: findArea,
                    message: 'findOne'
                });
            } catch (error) {
                next(error);
            }
        };
        this.create = async (req, res, next)=>{
            try {
                const data = req.body;
                const createAreaData = await this.service.create(data);
                res.status(201).json({
                    data: createAreaData,
                    message: 'created'
                });
            } catch (error) {
                next(error);
            }
        };
        this.update = async (req, res, next)=>{
            try {
                const id = Number(req.params.id);
                const data = req.body;
                const updateUserData = await this.service.update(id, data);
                res.status(200).json({
                    data: updateUserData,
                    message: 'updated'
                });
            } catch (error) {
                next(error);
            }
        };
        this.delete = async (req, res, next)=>{
            try {
                const id = Number(req.params.id);
                const deleteUserData = await this.service.delete(id);
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
const _default = ProcessController;

//# sourceMappingURL=process.controller.js.map