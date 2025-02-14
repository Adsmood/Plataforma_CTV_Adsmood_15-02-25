"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackEventDto = exports.TrackingQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TrackingQueryDto {
}
exports.TrackingQueryDto = TrackingQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Cache buster' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackingQueryDto.prototype, "cb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Timestamp' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackingQueryDto.prototype, "ts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'ID de campaña' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackingQueryDto.prototype, "campaignId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'ID de creativo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackingQueryDto.prototype, "creativeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'ID de inserción' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackingQueryDto.prototype, "insertionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'ID de sitio' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackingQueryDto.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'ID de dispositivo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackingQueryDto.prototype, "deviceId", void 0);
class TrackEventDto {
}
exports.TrackEventDto = TrackEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tipo de evento interactivo' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackEventDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Datos adicionales del evento' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], TrackEventDto.prototype, "data", void 0);
//# sourceMappingURL=tracking.dto.js.map