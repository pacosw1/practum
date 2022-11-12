"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _groupsService = _interopRequireDefault(require("../services/groups.service"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let GroupsController = class GroupsController {
    constructor(){
        this.service = new _groupsService.default();
        this.getAll = async (req, res, next)=>{
            try {
                const groups = await this.service.getAll();
                res.status(200).json({
                    data: groups,
                    message: 'findAll'
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
                const createData = await this.service.create(data);
                res.status(201).json({
                    data: createData,
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
                const groupData = await this.service.update(id, data);
                res.status(200).json({
                    data: groupData,
                    message: 'updated'
                });
            } catch (error) {
                next(error);
            }
        };
        this.delete = async (req, res, next)=>{
            try {
                const id = Number(req.params.id);
                const deleteData = await this.service.delete(id);
                res.status(200).json({
                    data: deleteData,
                    message: 'deleted'
                });
            } catch (error) {
                next(error);
            }
        };
    }
};
const _default = GroupsController;

//# sourceMappingURL=groups.controller.js.map