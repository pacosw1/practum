"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _entryService = _interopRequireDefault(require("../services/entry.service"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let EntriesController = class EntriesController {
    constructor(){
        this.service = new _entryService.default();
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
const _default = EntriesController;

//# sourceMappingURL=entries.controller.js.map