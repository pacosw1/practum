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
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
let ProcessService = class ProcessService {
    async getAll() {
        const all = await this.processes.findMany({
            orderBy: {
                id: 'asc'
            },
            where: {
                active: true
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
                tools: {
                    include: {
                        tool: true
                    }
                }
            }
        });
        if (!findProcess || findProcess && !findProcess.active) throw new _httpException.HttpException(409, "Area doesn't exist");
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
        if (findProcess || findProcess && !findProcess.active) throw new _httpException.HttpException(409, `Process with title ${data.name} already exists`);
        const connectEntries = Array.from(data.existingEntries.map((id)=>{
            return {
                isExit: false,
                entry: {
                    connect: {
                        id: id
                    }
                }
            };
        }));
        const newEntries = Array.from(data.newEntries.map((newEntry)=>{
            return {
                isExit: false,
                entry: {
                    create: _objectSpread({}, newEntry)
                }
            };
        }));
        const connectOutputs = Array.from(data.existingOutputs.map((id)=>{
            return {
                isExit: true,
                entry: {
                    connect: {
                        id: id
                    }
                }
            };
        }));
        const newOutputs = Array.from(data.newOutputs.map((newOutput)=>{
            return {
                isExit: true,
                entry: {
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
                    ...connectEntries,
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
                }
            }
        });
        if (!findProcess || findProcess && !findProcess.active) throw new _httpException.HttpException(409, "User doesn't exist");
        const oldEntries = await new _client.PrismaClient().entriesOnProcess.findMany({
            where: {
                processId: id,
                isExit: false
            }
        });
        const oldOutputs = await new _client.PrismaClient().entriesOnProcess.findMany({
            where: {
                processId: id,
                isExit: true
            }
        });
        const oldTools = await new _client.PrismaClient().toolsOnProcess.findMany({
            where: {
                processId: id
            }
        });
        const old = new Set();
        const updated = new Set();
        const disconnectEntries = [];
        const connectEntries = [];
        for (const entry of data.existingEntries){
            updated.add(entry);
        }
        for (const entry1 of oldEntries){
            old.add(entry1.entryId);
            if (!updated.has(entry1.entryId)) {
                disconnectEntries.push(entry1.entryId);
            }
        }
        for (const entry2 of data.existingEntries){
            if (!old.has(entry2)) {
                connectEntries.push({
                    isExit: false,
                    entry: {
                        connect: {
                            id: entry2
                        }
                    }
                });
            }
        }
        const oldOut = new Set();
        const updatedOut = new Set();
        const disconnectOutputs = [];
        const connectOutputs = [];
        for (const output of data.existingOutputs){
            updated.add(output);
        }
        for (const output1 of oldOutputs){
            old.add(output1.entryId);
            if (!updatedOut.has(output1.entryId)) {
                disconnectOutputs.push(output1.entryId);
            }
        }
        for (const output2 of data.existingOutputs){
            if (!oldOut.has(output2)) {
                connectOutputs.push({
                    isExit: true,
                    entry: {
                        connect: {
                            id: output2
                        }
                    }
                });
            }
        }
        const oldToolSet = new Set();
        const updatedTools = new Set();
        const disconnectTools = [];
        const connectTools = [];
        for (const tool of data.existingTools){
            updatedTools.add(tool);
        }
        for (const tool1 of oldTools){
            oldToolSet.add(tool1.toolId);
            if (!updatedTools.has(tool1.toolId)) {
                disconnectTools.push(tool1.toolId);
            }
        }
        for (const tool2 of data.existingTools){
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
        const newTools = Array.from(data.newTools.map((newTool)=>{
            return {
                tool: {
                    create: _objectSpread({}, newTool)
                }
            };
        }));
        const newEntries = Array.from(data.newEntries.map((newEntry)=>{
            return {
                entry: {
                    isExit: false,
                    create: _objectSpread({}, newEntry)
                }
            };
        }));
        const newOutputs = Array.from(data.newOutputs.map((newEntry)=>{
            return {
                isExit: true,
                entry: {
                    create: _objectSpread({}, newEntry)
                }
            };
        }));
        data.areaId = Number(data.areaId);
        data.groupId = Number(data.groupId);
        const finalData = {
            name: data.name,
            areaId: data.areaId,
            groupId: data.groupId,
            entries: {
                create: [
                    ...newEntries,
                    ...connectEntries,
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
        const entryClient = new _client.PrismaClient().entriesOnProcess;
        const toolClient = new _client.PrismaClient().toolsOnProcess;
        await entryClient.deleteMany({
            where: {
                processId: id,
                entryId: {
                    in: disconnectEntries
                },
                isExit: false
            }
        });
        await entryClient.deleteMany({
            where: {
                processId: id,
                entryId: {
                    in: disconnectOutputs
                },
                isExit: true
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
        const deleteProcess = await this.processes.update({
            where: {
                id: id
            },
            data: _objectSpreadProps(_objectSpread({}, findProcess), {
                active: false
            })
        });
        return deleteProcess;
    }
    constructor(){
        this.processes = new _client.PrismaClient().process;
    }
};
const _default = ProcessService;

//# sourceMappingURL=process.service.js.map