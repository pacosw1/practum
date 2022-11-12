"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    CreateProcessDto: ()=>CreateProcessDto,
    CreateEntryExitDto: ()=>CreateEntryExitDto,
    GetFilteredProcessesDto: ()=>GetFilteredProcessesDto
});
const _classValidator = require("class-validator");
var __decorate = (void 0) && (void 0).__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (void 0) && (void 0).__metadata || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let CreateProcessDto = class CreateProcessDto {
};
__decorate([
    (0, _classValidator.IsString)(),
    __metadata("design:type", String)
], CreateProcessDto.prototype, "name", void 0);
__decorate([
    (0, _classValidator.IsNumberString)(),
    __metadata("design:type", Number)
], CreateProcessDto.prototype, "areaId", void 0);
__decorate([
    (0, _classValidator.IsNumberString)(),
    __metadata("design:type", Number)
], CreateProcessDto.prototype, "groupId", void 0);
__decorate([
    (0, _classValidator.IsArray)(),
    __metadata("design:type", Array)
], CreateProcessDto.prototype, "newEntries", void 0);
__decorate([
    (0, _classValidator.IsArray)(),
    __metadata("design:type", Array)
], CreateProcessDto.prototype, "existingEntries", void 0);
__decorate([
    (0, _classValidator.IsArray)(),
    __metadata("design:type", Array)
], CreateProcessDto.prototype, "newOutputs", void 0);
__decorate([
    (0, _classValidator.IsArray)(),
    __metadata("design:type", Array)
], CreateProcessDto.prototype, "existingOutputs", void 0);
__decorate([
    (0, _classValidator.IsArray)(),
    __metadata("design:type", Array)
], CreateProcessDto.prototype, "newTools", void 0);
__decorate([
    (0, _classValidator.IsArray)(),
    __metadata("design:type", Array)
], CreateProcessDto.prototype, "existingTools", void 0);
let CreateEntryExitDto = class CreateEntryExitDto {
};
__decorate([
    (0, _classValidator.IsString)(),
    __metadata("design:type", String)
], CreateEntryExitDto.prototype, "name", void 0);
__decorate([
    (0, _classValidator.IsString)(),
    __metadata("design:type", String)
], CreateEntryExitDto.prototype, "description", void 0);
let GetFilteredProcessesDto = class GetFilteredProcessesDto {
};
__decorate([
    (0, _classValidator.IsNumberString)(),
    __metadata("design:type", Number)
], GetFilteredProcessesDto.prototype, "areaId", void 0);
__decorate([
    (0, _classValidator.IsNumberString)(),
    __metadata("design:type", Number)
], GetFilteredProcessesDto.prototype, "groupId", void 0);

//# sourceMappingURL=process.dto.js.map