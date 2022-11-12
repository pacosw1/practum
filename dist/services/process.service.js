"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _client = require("@prisma/client");
const _httpException = require("../exceptions/HttpException");
const _util = require("../utils/util");
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
let ProcessService = class ProcessService {
    async getAll() {
        const all = await this.processes.findMany({
            orderBy: {
                id: 'asc'
            }
        });
        return all;
    }
    async getGivenAreaAndGroup(areaId, groupId) {
        const filteredProcess = await this.processes.findMany({
            where: {
                areaId: areaId,
                groupId: groupId
            }
        });
        return filteredProcess;
    }
    async getGivenId(id) {
        if ((0, _util.isEmpty)(id)) throw new _httpException.HttpException(400, 'id is empty');
        const findProcess = await this.processes.findUnique({
            where: {
                id: id
            },
            include: {
                entries: {
                    include: {
                        entry: true
                    }
                },
                outputs: {
                    include: {
                        output: true
                    }
                },
                tools: {
                    include: {
                        tool: true
                    }
                }
            }
        });
        if (!findProcess) throw new _httpException.HttpException(409, "Area doesn't exist");
        return findProcess;
    }
    async create(data) {
        if ((0, _util.isEmpty)(data)) throw new _httpException.HttpException(400, 'userData is empty');
        data.areaId = Number(data.areaId);
        data.groupId = Number(data.groupId);
        const findProcess = await this.processes.findUnique({
            where: {
                name: data.name
            }
        });
        if (findProcess) throw new _httpException.HttpException(409, `Process with title ${data.name} already exists`);
        const connectEntries = Array.from(data.existingEntries.map((id)=>{
            return {
                entry: {
                    connect: {
                        id: id
                    }
                }
            };
        }));
        const newEntries = Array.from(data.newEntries.map((newEntry)=>{
            return {
                entry: {
                    create: _objectSpread({}, newEntry)
                }
            };
        }));
        const connectOutputs = Array.from(data.existingOutputs.map((id)=>{
            return {
                output: {
                    connect: {
                        id: id
                    }
                }
            };
        }));
        const newOutputs = Array.from(data.newOutputs.map((newOutput)=>{
            return {
                output: {
                    create: _objectSpread({}, newOutput)
                }
            };
        }));
        const connectTools = Array.from(data.existingTools.map((id)=>{
            return {
                tool: {
                    connect: {
                        id: id
                    }
                }
            };
        }));
        const newTools = Array.from(data.newTools.map((newTool)=>{
            return {
                tool: {
                    create: _objectSpread({}, newTool)
                }
            };
        }));
        const finalData = {
            name: data.name,
            areaId: data.areaId,
            groupId: data.groupId,
            entries: {
                create: [
                    ...newEntries,
                    ...connectEntries
                ]
            },
            outputs: {
                create: [
                    ...newOutputs,
                    ...connectOutputs
                ]
            },
            tools: {
                create: [
                    ...newTools,
                    ...connectTools
                ]
            }
        };
        const createData = await this.processes.create({
            data: _objectSpread({}, finalData)
        });
        return createData;
    }
    async update(id, data) {
        if ((0, _util.isEmpty)(data)) throw new _httpException.HttpException(400, 'userData is empty');
        const findProcess = await this.processes.findUnique({
            where: {
                id: id
            },
            include: {
                entries: {
                    include: {
                        entry: true
                    }
                },
                outputs: {
                    include: {
                        output: true
                    }
                }
            }
        });
        if (!findProcess) throw new _httpException.HttpException(409, "User doesn't exist");
        let oldEntries = await new _client.PrismaClient().entriesOnProcess.findMany({
            where: {
                processId: id
            }
        });
        let oldOutputs = await new _client.PrismaClient().outputsOnProcess.findMany({
            where: {
                processId: id
            }
        });
        let oldTools = await new _client.PrismaClient().toolsOnProcess.findMany({
            where: {
                processId: id
            }
        });
        let old = new Set();
        let updated = new Set();
        let disconnectEntries = [];
        let connectEntries = [];
        for (let entry of data.existingEntries){
            updated.add(entry);
        }
        for (let entry1 of oldEntries){
            old.add(entry1.entryId);
            if (!updated.has(entry1.entryId)) {
                disconnectEntries.push(entry1.entryId);
            }
        }
        for (let entry2 of data.existingEntries){
            if (!old.has(entry2)) {
                connectEntries.push({
                    entry: {
                        connect: {
                            id: entry2
                        }
                    }
                });
            }
        }
        let oldOut = new Set();
        let updatedOut = new Set();
        let disconnectOutputs = [];
        let connectOutputs = [];
        for (let output of data.existingOutputs){
            updated.add(output);
        }
        for (let output1 of oldOutputs){
            old.add(output1.outputId);
            if (!updatedOut.has(output1.outputId)) {
                disconnectOutputs.push(output1.outputId);
            }
        }
        for (let output2 of data.existingOutputs){
            if (!oldOut.has(output2)) {
                connectOutputs.push({
                    output: {
                        connect: {
                            id: output2
                        }
                    }
                });
            }
        }
        let oldToolSet = new Set();
        let updatedTools = new Set();
        let disconnectTools = [];
        let connectTools = [];
        for (let tool of data.existingTools){
            updatedTools.add(tool);
        }
        for (let tool1 of oldTools){
            oldToolSet.add(tool1.toolId);
            if (!updatedTools.has(tool1.toolId)) {
                disconnectTools.push(tool1.toolId);
            }
        }
        for (let tool2 of data.existingTools){
            if (!oldToolSet.has(tool2)) {
                connectTools.push({
                    tool: {
                        connect: {
                            id: tool2
                        }
                    }
                });
            }
        }
        let newTools = Array.from(data.newTools.map((newTool)=>{
            return {
                tool: {
                    create: _objectSpread({}, newTool)
                }
            };
        }));
        let newEntries = Array.from(data.newEntries.map((newEntry)=>{
            return {
                entry: {
                    create: _objectSpread({}, newEntry)
                }
            };
        }));
        let newOutputs = Array.from(data.newOutputs.map((newOutput)=>{
            return {
                output: {
                    create: _objectSpread({}, newOutput)
                }
            };
        }));
        data.areaId = Number(data.areaId);
        data.groupId = Number(data.groupId);
        let finalData = {
            name: data.name,
            areaId: data.areaId,
            groupId: data.groupId,
            entries: {
                create: [
                    ...newEntries,
                    ...connectEntries
                ]
            },
            outputs: {
                create: [
                    ...newOutputs,
                    ...connectOutputs
                ]
            },
            tools: {
                create: [
                    ...newTools,
                    ...connectTools
                ]
            }
        };
        let entryClient = new _client.PrismaClient().entriesOnProcess;
        let outputClient = new _client.PrismaClient().outputsOnProcess;
        let toolClient = new _client.PrismaClient().toolsOnProcess;
        let deleteEntries = await entryClient.deleteMany({
            where: {
                processId: id,
                entryId: {
                    in: disconnectEntries
                }
            }
        });
        let deleteOutputs = await outputClient.deleteMany({
            where: {
                processId: id,
                outputId: {
                    in: disconnectOutputs
                }
            }
        });
        let deleteTools = await toolClient.deleteMany({
            where: {
                processId: id,
                toolId: {
                    in: disconnectTools
                }
            }
        });
        const newProcess = await this.processes.update({
            where: {
                id: id
            },
            data: _objectSpread({}, finalData)
        });
        return newProcess;
    }
    async delete(id) {
        if ((0, _util.isEmpty)(id)) throw new _httpException.HttpException(400, "User doesn't existId");
        const findProcess = await this.processes.findUnique({
            where: {
                id: id
            }
        });
        if (!findProcess) throw new _httpException.HttpException(409, "User doesn't exist");
        const deleteProcess = await this.processes.delete({
            where: {
                id: id
            }
        });
        return deleteProcess;
    }
    constructor(){
        this.processes = new _client.PrismaClient().process;
    }
};
const _default = ProcessService;

//# sourceMappingURL=process.service.js.map